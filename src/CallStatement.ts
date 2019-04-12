import { Compiler } from "./Compiler";
import { Subroutine } from "./Subroutine";

export class CallStatement {
    private loc: number;
    private statement: string[];
    private curSubs: Subroutine[] = [];
    private tags: string[] = [];
    public returnsPointer: boolean;

    public constructor(loc: number, statement: string[]) {
        this.loc = loc;
        this.statement = statement;
        Compiler.Subroutines.forEach(sub => this.curSubs.push(sub));
        this.returnsPointer = statement.lastIndexOf(")") >= statement.lastIndexOf(".");
    }

    public get PointerName(): string {
        if (this.eqIndex > -1) {
            return this.statement[1];
        } else {
            return null;
        }
    }

    public get SubName(): string {
        let eqLoc = this.eqIndex;
        if (eqLoc > -1) {
            return this.statement[eqLoc + 1];
        } else {
            return this.statement[1];
        }
    }

    private get eqIndex(): number {
        for (let i: number = 0; i < this.statement.length; i++) {
            if (this.statement[i].endsWith("=")) return i;
        }
        return -1;
    }
}
