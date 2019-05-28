#!/bin/bash
rm -rf build/*

for var in "$@"
do
    echo "Building: $var"
    PATHPARTS=(${var//\// })
    FILENAME=(${PATHPARTS[-1]})
    NAME=$(echo $FILENAME| cut -d'.' -f 1)
    node bin/index.js -i $var -o build/$NAME.asm -a 64
    nasm -f elf64 -o build/$NAME.o build/$NAME.asm
done

echo "Linking..."
ld -e _start -o build/out build/*.o
echo "Done! Result is build/out"