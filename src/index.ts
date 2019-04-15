import { readFileSync } from "fs";
import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { Parser } from "./Parser";
import { Token } from "./Token";
import { Tokenizer } from "./Tokenizer";

let sourceFile: string = "main.ns";
if (process.argv.length > 2) {
    sourceFile = process.argv[2];
}
let fileBuffer: Buffer = readFileSync(sourceFile);

let outFile: string = "main.asm";
if (process.argv.length > 3) {
    outFile = process.argv[3];
}
let code: string = fileBuffer.toString("utf8");
let tokens: Token[] = Tokenizer.tokenize(code);

console.log("\nSource NuStack:");
console.log(fileBuffer.toString("utf8"));
console.log("\nTokens:");
console.log(JSON.stringify(tokens.map(tok => tok.toString())));

let ast: AbstractSyntaxTree = Parser.Parse(tokens);

console.log("\nAST:");
console.log(JSON.stringify(ast, null, 2));
