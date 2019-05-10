import { AssemblyGenerator } from "./ASM/AssemblyGenerator";
import { PlatformController } from "./ASM/PlatformController";
import { PlatformController32 } from "./ASM/PlatformController32";
import { PlatformController64 } from "./ASM/PlatformController64";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ASTPass } from "./AST/ASTPass";
import { Parser } from "./Parser";
import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";

export class NuStack {
    private static debug: boolean;

    public static compile(code: string, platform: string = "32", debug: boolean = false): string {
        this.debug = debug;
        this.log("\nSource NuStack:");
        this.log(code);
        let tokens: Token[] = Tokenizer.tokenize(code);
        this.log("\nTokens:");
        this.log(JSON.stringify(tokens.map(tok => tok.toString())));
        let ast: AbstractSyntaxTree = Parser.parse(tokens);
        this.log("\nAST:");
        this.log(ast.toString());
        let platformController: PlatformController;
        if (platform === "32") platformController = new PlatformController32();
        else if (platform === "64") platformController = new PlatformController64();
        let asm: string = AssemblyGenerator.generate(ast, platformController);
        this.log("\nNASM:");
        this.log(asm);

        return asm;
    }

    private static log(msg: string): void {
        if (this.debug) console.log(msg);
    }
}
