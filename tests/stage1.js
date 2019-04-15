const NuStack = require("../bin/NuStack").NuStack;

function getInput(i) {
    return `int main(){
    return ${i};
}`;
}

function getOutput(i) {
    return `main:
movl ${i}d, eax
ret`
}

for (let i = 0; i < 1000; i++) {
    let x = Math.floor(Math.random() * (2 ** 31));

    console.log("Testing for " + x);
    let output = NuStack.compile(getInput(x), true);

    let expectedOutput = getOutput(x);

    if (output === expectedOutput) {
        console.log("Success!\n");
    } else {
        console.log("Failed! Expected:");
        console.log(expectedOutput);
        console.log("\nBut got:");
        console.log(output);
        break;
    }
}