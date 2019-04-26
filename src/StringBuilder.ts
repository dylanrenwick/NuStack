export class StringBuilder {
    private buffer: string = "";

    public indent: number = 0;

    private get i(): string { return "  ".repeat(this.indent); }

    public append(item: string): void {
        this.buffer += this.i + item;
    }
    public appendLine(item: string): void {
        this.buffer += this.i + item + "\n";
    }

    public startBlock(title: string): void {
        this.appendLine(title + " {");
        this.indent++;
    }
    public endBlock(): void {
        this.indent--;
        this.appendLine("}");
    }

    public toString(): string {
        return this.buffer;
    }
}
