const fs = require("fs");
const exec = require("child_process").exec;

if (!fs.existsSync("examples/tests.json")) {
    console.log("No tests found");
    process.exit(0);
}

const tests = require("../examples/tests.json");

for (let test of tests) {
    let testName = test.fileName;
    let expected = test.answer;

    for (let i = 0; i < 3; i++) {
        let realName = testName + "-" + i;

        exec("node bin/index.js -i examples/" + testName + ".ns -o examples/" + realName + ".asm -a 64 -O " + i
            + " && nasm -f elf64 -o examples/" + realName + ".o examples/" + realName + ".asm"
            + " && ld -e main -o examples/" + realName + " examples/" + realName + ".o",
        (err, stdout, stderr) => {
            if (err) {
                console.log(testName + " - FAIL");
                console.log(stdout);
                console.log(stderr);
            }
        });
        exec("./examples/" + testName, (err, stdout, stderr) => {
            let outCode = 0;
            if (err) outCode = err.code;

            console.log(outCode, expected);

            if (outCode !== expected) {
                console.log("Expected " + expected + " but got " + outCode);
                console.log(stdout);
                console.log(stderr);
            }
        })
    }
}