import { Arg } from "./Arg";
import { Command } from "./Command";
import { Compiler } from "./Compiler";
import { HashMap } from "./HashMap";
import { OpenLoop } from "./OpenLoop";

export class Subroutine {
    public name: string;
    public address: HashMap<string, number> = new HashMap<string, number>();
    public firstFreeRAM: number = 0;
    public type: HashMap<string, string> = new HashMap<string, string>();
    public RAMmap: string[] = [];
    public inits: Command[][] = [];
    public args: string[] = [];
    public loop: OpenLoop;

    public constructor(name: string, loop: OpenLoop) {
        this.name = name;
        this.loop = loop;
        this.createWord("return");
        this.createWord("previous_call");
    }

    public Print(): void {
        console.log(this.name);
        for (let i: number; i < this.args.length; i++) {
            console.log(this.args[i]);
            for (let j: number; j < this.inits[i].length; j++) {
                console.log(j + ". " + this.inits[j][i]);
            }
        }
    }

    public setRAM(marker: number, name: string) {
        this.address.Add(name, marker);
        while (this.RAMmap.length - 1 < marker) {
            this.RAMmap.push("");
        }
        if (this.RAMmap[marker] === "") {
            this.RAMmap[marker] = name;
        } else {
            this.RAMmap[marker] += " " + name;
        }
    }

    public createWord(varname: string, data?: number): void {
        this.args.push(varname);
        let ROMpredefs: Command[] = [];
        this.inits.push(ROMpredefs);
        this.setRAM(this.firstFreeRAM, varname);
        this.type.Add(varname, Compiler.WordType);
        if (data !== undefined) {
            ROMpredefs.push(new Command("ADD", new Arg(1, name, 0),
                new Arg(this.firstFreeRAM), new Arg(Compiler.CallStackPointer, 0)));
            ROMpredefs.push(new Command("MLZ", new Arg(-1), new Arg(data),
                new Arg(1, Compiler.CallStackPointer, 0)));
        }
        this.firstFreeRAM++;
    }
}