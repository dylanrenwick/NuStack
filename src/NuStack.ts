import { AssemblyGenerator } from "./AssemblyGenerator";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ASTPass } from "./AST/ASTPass";
import { ConstantFolder } from "./AST/ConstantFolder";
import { SSAReducer } from "./AST/SSAReducer";
import { Parser } from "./Parser";
import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";

export class NuStack {
    private static debug: boolean;

    private static passes: ASTPass[][] = [
        [new ConstantFolder()],
        [new SSAReducer()]
    ];

    public static compile(code: string, debug: boolean = false, optimization = 0): string {
        this.debug = debug;
        this.log("\nSource NuStack:");
        this.log(code);
        let tokens: Token[] = Tokenizer.tokenize(code);
        this.log("\nTokens:");
        this.log(JSON.stringify(tokens.map(tok => tok.toString())));
        let ast: AbstractSyntaxTree = Parser.parse(tokens);
        this.log("\nAST:");
        this.log(ast.toString());
        for (let i = 0; i < optimization; i++) {
            for (let pass of this.passes[i]) {
                ast = pass.SimplifyTree(ast);
            }
        }
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
