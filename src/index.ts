import { option, parse } from "args";
import { readFileSync, writeFileSync } from "fs";
import { NuStack } from "./NuStack";

option("input-file", "The source file from which to read code", "main.ns");
option("output-file", "The file to write compiled ASM to", "main.asm");
option("debug", "Display debug information during compile");

const args = parse(process.argv);

let sourceFile = args.i;
let outFile = args.o;
let debug = args.d;

let fileBuffer: Buffer = readFileSync(sourceFile);

let code: string = fileBuffer.toString("utf8");

let asm: string = NuStack.compile(code, debug);

writeFileSync(outFile, asm);
