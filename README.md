# NuStack [![Build Status](https://travis-ci.com/dylanrenwick/NuStack.svg?branch=master)](https://travis-ci.com/dylanrenwick/NuStack)[![Coverage Status](https://coveralls.io/repos/github/dylanrenwick/NuStack/badge.svg?branch=master)](https://coveralls.io/github/dylanrenwick/NuStack?branch=master)
NuStack is a new WIP compiled language, heavily inspired by C and Perl 6.  
The main goal of this project is to experiment with building "true" compilers and learn more about asm in the process.

The compiler is written entirely in TypeScript, and is run via `node bin/index.js`  

## Quickstart
Quick commands to compile and run code:
```
npm run build                                         # Compile compiler
node bin/index.js -i inFile.ns -o outFile.asm -a 64   # Compile NuStack source
nasm -f elf64 -o objFile.o outFile.asm                # Assemble asm output
ld -e main -o bin objFile.o                           # Link obj file
./bin                                                 # Run executable
```