# NuStack [![Build Status](https://travis-ci.com/dylanrenwick/NuStack.svg?branch=master)](https://travis-ci.com/dylanrenwick/NuStack) [![Coverage Status](https://coveralls.io/repos/github/dylanrenwick/NuStack/badge.svg?branch=master)](https://coveralls.io/github/dylanrenwick/NuStack?branch=master)
NuStack is a new WIP compiled language, heavily inspired by C and Perl 6.  
The main goal of this project is to experiment with building "true" compilers and learn more about asm in the process.

The compiler is written entirely in TypeScript, and is run via `node bin/index.js <inputFileName> <outputFileName>`  
If no `inputFileName` is given, the compiler defaults to `main.ns`. If no `outputFileName` is given, the compiler defaults to `main.asm`.  
The compiler consumes a NuStack source code file (currently only supports `utf8` encoding) and produces a `nasm` syntax assembly file, which can then be passed to the assembler with `nasm <assemblyFileName>`
