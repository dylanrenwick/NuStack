import { AssemblyGenerator } from "./AssemblyGenerator";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ConstantFolder } from "./AST/ConstantFolder";
import { Parser } from "./Parser";
import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";

export class NuStack {
    private static debug: boolean;

    public static compile(code: string, debug: boolean = false): string {
        this.debug = debug;
        this.log("\nSource NuStack:");
        this.log(code);
        let tokens: Token[] = Tokenizer.tokenize(code);
        this.log("\nTokens:");
        this.log(JSON.stringify(tokens.map(tok => tok.toString())));
        let ast: AbstractSyntaxTree = Parser.parse(tokens);
        this.log("\nAST:");
        this.log(ast.toString());
        ast = ConstantFolder.SimplifyTree(ast);
        this.log("\nSimplified AST:");
        this.log(ast.toString());
        let asm: string = AssemblyGenerator.generate(ast);
        this.log("\nNASM:");
        this.log(asm);

        return asm;
    }

    private static log(msg: string): void {
        if (this.debug) console.log(msg);
    }
}
