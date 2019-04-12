import { CallStatement } from "./CallStatement";
import { Command } from "./Command";
import { HashMap } from "./HashMap";
import { Subroutine } from "./Subroutine";
import { OpenLoop } from "./OpenLoop";
import { Arg } from "./Arg";

export class Compiler {
    public static WordType: string = "word";
    public static ArrayType: string = "array";

    public static CallStackPointer: string = "call";
    public static Subroutines: Subroutine[] = [];
    public static Loops: OpenLoop[] = [];

    private static tokens: string[];

    private static firstFreeRAM: number = 0;
    private static mainROM: Command[] = [];
    private static RAMmap: string[] = [];
    private static scratch: string[] = [];
    private static prevCall: CallStatement;
    private static type: HashMap<string, string> = new HashMap<string, string>();
    private static address: HashMap<string, number> = new HashMap<string, number>();

    public static Compile(tokenList?: string[]): void {
        let calls: CallStatement[] = [];

        if (tokenList !== undefined) this.tokens = tokenList;
        while (this.tokens.length > 0) {
            this.clearS();
            if (this.tokens[0] === "call") {
                let call: CallStatement = new CallStatement(this.mainROM.length, this.rmStatementTokens());
                if (call.PointerName !== null) {
                    let isLocal: Subroutine = null;
                    for (let i: number = Compiler.Subroutines.length - 1; i >= 0; i--) {
                        if (Compiler.Subroutines[i].args.includes(call.PointerName)) {
                            isLocal = Compiler.Subroutines[i];
                        }
                    }
                    if (call.returnsPointer) {
                        if (isLocal === null) {
                            this.type.Add(call.PointerName, call.SubName);
                        } else {
                            isLocal.type.Add(call.PointerName, call.SubName);
                        }
                    }
                }
                calls.unshift(call);
                this.prevCall = call;
            } else {
                let startSize: number = this.mainROM.length;
                switch (this.tokens[0]) {
                    case "my":
                        this.compileDef();
                        break;
                    case "if":
                    case "while":
                        this.compileLoopStart(this.mainROM);
                        break;
                    case "do":
                        this.compileDoWhile(this.mainROM);
                        break;
                    case "sub":
                        this.compileSub(this.mainROM);
                        break;
                    case "}":
                        this.compileLoopStop(this.mainROM);
                        break;
                    case "return":
                        this.compileReturn(this.mainROM);
                        this.mainROM[this.mainROM.length - 1].tags.push("return");
                        break;
                    default:
                        this.compileMove(this.mainROM);
                }

                if (this.mainROM.length > startSize) {
                    this.prevCall = null;
                }
            }
        }
        for (let call of calls) {
            this.clearS();
            this.compileCall(this.mainROM, call);
        }
        this.setRAM(this.firstFreeRAM, Compiler.CallStackPointer);
        this.type.Add(Compiler.CallStackPointer, this.ArrayType);
        this.firstFreeRAM++;
    }

    private static setRAM(marker: number, name: string): void {
        this.address.Add(name, marker);
        while(this.RAMmap.length - 1 < marker) {
            this.RAMmap.push("");
        }
        if (this.RAMmap[marker] === "") {
            this.RAMmap[marker] = name;
        } else {
            this.RAMmap[marker] += " " + name;
        }
    }

    private static compileLoopStart(ROM: Command[]): void {
        let type: string = this.tokens.shift();
        let loop: OpenLoop = new OpenLoop(type);
        this.Loops.unshift(loop);
        this.tokens.shift(); // Remove open paren

        let cond: Command[] = [];

        let arg1: Arg = this.compileRef(cond, false);
        let op: string = this.tokens.shift();
        let arg2: Arg = new Arg(0);
        if (op === ")") {
            op = "!=";
        } else {
            arg2 = this.compileRef(cond, false);
            this.tokens.shift(); // Remove close paren
        }
        let oBrace: string = this.tokens.shift();
        while (oBrace !== "{") {
            loop.name += "_" + oBrace;
            oBrace = this.tokens.shift();
        }

        if (type === "while") {
            let test: Arg = null;
            if (arg2.mode === 0 && op === "<=") {
                arg2.val++;
                op = "<";
            }
            if (arg1.mode === 0 && op === "<=") {
                arg1.val--;
                op = "<";
            }
            if (arg2.mode === 0 && op === ">=") {
                arg2.val--;
                op = ">";
            }
            if (arg1.mode === 0 && op === ">=") {
                arg1.val++;
                op = ">";
            }
        }

        ROM.push(new Command("MOV", [
            new Arg() {
                tag: "end" + loop,
                tagoffset: 0
            };
        ], "begin" + loop));
    }

    private static compileDef(): void {
    
    }

    private static rmStatementTokens(): string[] {
        let res: string[] = [];
        while (this.tokens.length > 0 && this.tokens[0] !== ";") {
            res.push(this.tokens.shift());
        }
        if (this.tokens.length > 0 && this.tokens[0] === ";") {
            res.push(this.tokens.shift());
        }
        return res;
    }

    private static clearS(): void {
        for (let i: number = 0; i < this.scratch.length; i++) {
            this.scratch[i] = "free";
        }
    }
}