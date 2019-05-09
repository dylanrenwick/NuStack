const fs = require("fs");
const exec = require("child_process").exec;

if (!fs.existsSync("examples/tests.json")) {
    console.log("No tests found");
    process.exit(0);
}

const tests = require("../examples/tests.json");

let finishedTests = {};

let errs = "";

for (let test of tests) {
    let output = "";
    let testName = test.fileName;
    let expected = test.answer;

    finishedTests[testName] = [];

    output += ("Running " + testName) + "\n";

    for (let i = 0; i < 3; i++) {
        let realName = testName + "-" + i;

        exec("node bin/index.js -i examples/" + testName + ".ns -o examples/" + realName + ".asm -a 64 -O " + i
            + " && nasm -f elf64 -o examples/" + realName + ".o examples/" + realName + ".asm"
            + " && ld -e main -o examples/" + realName + " examples/" + realName + ".o",
        (err, stdout, stderr) => {
            if (err) {
                output += ("\t" + realName + " - COMPILE FAIL") + "\n";
                errs += stdout + "\n";
                errs += stderr + "\n";
            }
            exec("./examples/" + realName, (err, stdout, stderr) => {
                let outCode = 0;
                if (err) outCode = err.code;
    
                if (outCode !== expected) {
                    output += ("\t" + realName + " - FAIL: Expected " + expected + " but got " + outCode) + "\n";
                    errs += stdout + "\n";
                    errs += stderr + "\n";
                } else {
                    output += ("\t" + realName + " - PASS: Expected " + expected + " and got " + outCode) + "\n";
                }

                registerFinish(testName, i, output);
            });
        });
    }
}

function registerFinish(testName, i, output) {
    if (!finishedTests[testName].includes(i)) finishedTests[testName].push(i);

    if (finishedTests[testName].includes(0)
        && finishedTests[testName].includes(1)
        && finishedTests[testName].includes(2))
        console.log(output);

    if (errs.trim().length) {
        if (Object.keys(finishedTests).filter(x => finishedTests.hasOwnProperty(x))
            .filter(x => tests.map(y => y.fileName).includes(x)).length) {
                console.log(errs.trim());
            }
    }
}
