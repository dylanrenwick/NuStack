export class Arg {
    public mode: number;
    public val: number;
    public tag: string;
    public tagoffset: number;
    public sub: string;
    public scratches: Arg[] = [];

    public constructor(val?: number, tag?: string, tagoffset?: number, sub?: string, mode?: number) {
        if (val !== undefined && val !== null) this.val = val;
        if (tag !== undefined && tag !== null) this.tag = "";
        if (tagoffset !== undefined && tagoffset !== null) this.tagoffset = tagoffset;
        if (sub !== undefined) this.sub = sub;
        if (mode !== undefined) this.mode = mode;
    }

    public ToString(): string {
        let res: string = Arg.getModePrefix(this.mode);
        if (this.val !== null) {
            res += this.val;
        } else {
            res += "(";
            if (this.sub != null) {
                res += this.sub + ".";
            }
            res += this.tag;
            if (this.tagoffset < 0) {
                res += this.tagoffset;
            } else if (this.tagoffset > 0) {
                res += "+" + this.tagoffset;
            }
            res += ")";
        }
        return res;
    }

    public Clone(): Arg {
        return new Arg(this.val, this.tag, this.tagoffset, this.sub, this.mode);
    }

    public static getModePrefix(mode: number): string {
        switch (mode) {
            case 0:
                return "";
            case 1:
                return "A";
            case 2:
                return "B";
            case 3:
                return "C";
            default:
                return "(" + mode + ")";
        }
    }
}
