const fs = require("fs");
const exec = require("child_process").exec;

if (!fs.existsSync("examples/tests.json")) {
    console.log("No tests found");
    process.exit(0);
}

const tests = require("../examples/tests.json");

for (let test of tests) {
    for (let i = 0; i < 3; i++) {
        let testName = test.fileName;
        let expected = test.answer;

        exec("node bin/index.js -i examples/" + testName + " -o examples/" + testName.split(".")[0] + ".asm -O " + i
            + " && nasm -f elf64 -o examples/" + testName.split(".")[0] + ".o examples/" + testName.split(".")[0] + ".asm"
            + " && ld -e main -o examples/" + testName.split(".")[0] + " examples/" + testName.split(".")[0] + ".o",
        (err, stdout, stderr) => {
            if (err) {
                console.log(testName + " - FAIL");
                console.log("Expected " + expected + " but got " + outCode);
                console.log(stdout);
                console.log(stderr);
            }
        });
        exec("./examples/" + testName.split(".")[0], (err, stdout, stderr) => {
            let outCode = 0;
            if (err) outCode = err.code;

            console.log(outCode, expected);

            if (outCode !== expected) {
                console.log(stdout);
                console.log(stderr);
            }
        })
    }
}