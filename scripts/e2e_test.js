const fs = require("fs");
const exec = require("child_process").exec;

if (!fs.existsSync("examples/tests.json")) {
    console.log("No tests found");
    process.exit(0);
}

const tests = require("../examples/tests.json");

let finishedTests = {};

let errs = "";

let result = 0;

const colors = {
    red: "\u001b[31m",
    green: "\u001b[32m",
    reset: "\u001b[0m"
};

console.log(tests.length + " tests to run");

for (let test of tests) {
    let output = "";
    let testName = test.fileName;
    let expected = test.answer;

    finishedTests[testName] = false;

    output += ("Running " + testName) + "\n";

    exec("node bin/index.js -i examples/" + testName + ".ns -o examples/" + testName + ".asm -a 64"
        + (process.argv.includes("-d") ? " -d" : "")
        + " && nasm -f elf64 -o examples/" + testName + ".o examples/" + testName + ".asm"
        + " && ld -e main -o examples/" + testName + " examples/" + testName + ".o",
    (err, stdout, stderr) => {
        if (err) {
            output += (`\t - ${colors.red}COMPILE FAIL${colors.reset}`) + "\n";
            errs += stdout + "\n";
            errs += stderr + "\n";
            result = 1;

            finishedTests[testName] = true;
            console.log(output);
        } else {
            exec("./examples/" + testName, (err, stdout, stderr) => {
                let outCode = 0;
                if (err) outCode = err.code;
    
                if (outCode !== expected) {
                    output += (`\t - ${colors.red}FAIL${colors.reset}: Expected ${expected} but got ${outCode}`) + "\n";
                    errs += stdout + "\n";
                    errs += stderr + "\n";
                    result = 1;
                } else {
                    output += (`\t - ${colors.green}PASS${colors.reset}: Expected ${expected} and got ${outCode}`) + "\n";
                }

                finishedTests[testName] = true;
                console.log(output);
            });
        }
    });
}

function wait() {
    let finishedTestNames = Object.keys(finishedTests).filter(x => finishedTests.hasOwnProperty(x)).filter(x => finishedTests[x]);
    let unfinished = tests.map(x => x.fileName).filter(x => !finishedTestNames.includes(x));

    if (!unfinished.length) {
        if (errs.trim().length) {
            console.log(errs.trim());
        }
        process.exit(result);
    } else {
        setTimeout(wait, 1000);
    }
}

setTimeout(wait, 1000);
