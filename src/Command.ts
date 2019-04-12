import { Arg } from "./Arg";

export class Command {
    public opcode: string;
    public args: Arg[];
    public tags: string[] = [];

    public constructor(opcode: string, args: Arg[], tag?: string) {
        this.opcode = opcode;
        this.args = args;
        if (tag !== undefined) this.tags.push(tag);
    }

    /*public simplify(): void {
        if (this.opcode === "SUB" && this.arg2.mode === 0) {
            this.opcode = "ADD";
            this.arg2 = this.arg2.Clone();
            this.arg2.val *= -1;
        }
        if (this.isSymmetric()) {
            if (this.arg1.mode < this.arg2.mode
                || (this.arg1.mode === this.arg2.mode
                    && this.arg1.val < this.arg2.val)) {
                let temp: Arg = this.arg1;
                this.arg1 = this.arg2;
                this.arg2 = temp;
           }
        }
        if (this.opcode === "MLZ")
    }*/
}
