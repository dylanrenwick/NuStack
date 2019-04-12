import * as fs from "fs";

import { Compiler } from "./Compiler";
import { Tokenizer } from "./Tokenizer";

let sourceFile: string = "main.ns";
if (process.argv.length > 2) {
    sourceFile = process.argv[2];
}
let fileBuffer: Buffer = fs.readFileSync(sourceFile);

let outFile: string = "main.asm";
if (process.argv.length > 3) {
    outFile = process.argv[3];
}
let lines: string[] = fileBuffer.toString("utf8").split("\n");
lines.forEach(line => Tokenizer.Tokenize(line));

console.log("\nSource NuStack:");
console.log(fileBuffer.toString("utf8"));
console.log("\nTokens:");
console.log(JSON.stringify(Tokenizer.Tokens));

let tokens: string[] = Tokenizer.Tokens;

Compiler.Compile(tokens);
