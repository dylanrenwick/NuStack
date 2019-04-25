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

let debug: boolean = false;
if (process.argv.length > 4) {
    debug = process.argv[4] === "-d";
}

let asm: string = NuStack.compile(code, debug);

writeFileSync(outFile, asm);
