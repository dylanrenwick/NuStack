import { readFileSync, writeFileSync } from "fs";
import { NuStack } from "./NuStack";

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

NuStack.compile(code);

// writeFileSync(outFile, asm);
