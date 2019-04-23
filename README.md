# NuStack [![Build Status](https://travis-ci.com/dylanrenwick/NuStack.svg?branch=master)](https://travis-ci.com/dylanrenwick/NuStack)
NuStack is a new WIP compiled language, heavily inspired by C and Perl 6.  
The main goal of this project is to experiment with building "true" compilers and learn more about asm in the process.

The compiler is written entirely in TypeScript, and is run via `node bin/index.js <inputFileName> <outputFileName>`  
If no `inputFileName` is given, the compiler defaults to `main.ns`. If no `outputFileName` is given, the compiler defaults to `main.asm`.  
The compiler consumes a NuStack source code file (currently only supports `utf8` encoding) and produces a `nasm` syntax assembly file, which can then be passed to the assembler with `nasm <assemblyFileName>`

## NPM Scripts

I've included a few basic `npm` scripts to make dev work easier:
```
clean - performs an rm -rf on bin/ and coverage/
build - performs a clean, then runs tsc
        Note: this requires you have the typescript npm module installed globally
            npm i -g typescript
run - performs a build, then runs the compiler.
      Note: this will not pass any file names, so the compiler will fall back to default input/output files
test - performs a build, then runs nyc mocha. This runs all unit tests and performs code coverage analysis on them
       Note: this will create the coverage/ directory containing a html report of the coverage
```
Currently [TravisCI](https://travis-ci.com/dylanrenwick/NuStack) is configured to execute `npm ci`, followed by `npm test`.  
This will set up the development environment, build the application, and execute all unit tests.

There is currently no setup to access the complete coverage report from within TravisCI
