const NuStack = require("../bin/NuStack").NuStack;

function getInput(i) {
    return `int main(){
    return ${i};
}`;
}

function getOutput(i) {
    return `main:\nmov eax, ${i}d\nret`;
}

for (let i = 0; i < 1000; i++) {
    let x = Math.floor(Math.random() * (2 ** 31));

    console.log("Testing for " + x);
    let output = NuStack.compile(getInput(x));

    let expectedOutput = getOutput(x);

    if (output.includes(expectedOutput)) {
        console.log("Success!");
    } else {
        console.log("Failed! Expected:");
        console.log(expectedOutput);
        console.log("(Length: " + expectedOutput.length + ")");
        console.log("\nBut got:");
        console.log(output);
        console.log("(Length: " + output.length + ")");
        break;
    }
}