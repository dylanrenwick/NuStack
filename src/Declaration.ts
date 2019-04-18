export class Declaration {
    private varName: string;
    private type: string;
    private values: any[];

    public get variableName(): string { return this.varName; }
    public get currentIndex(): number { return this.values.length - 1; }
    public get currentValue(): any { return this.values[this.currentIndex]; }
    public get variableType(): string { return this.type; }

    public constructor(varName: string, type: string) {
        this.varName = varName;
        this.type = type;
    }

    public getValue(index: number): any {
        return this.values[index];
    }

    public addValue(value: any): number {
        if (this.typeCheck(value)) {
            this.values.push(value);
            return this.values.length - 1;
        } else {
            throw new Error("Variable " + this.varName + " is of type "
                + this.type + " but value given was of type " + typeof(value));
        }
    }

    private typeCheck(value: any): boolean {
        switch (this.type) {
            case "int":
                return typeof(value) === "number" && (value as number) % 1 === 0;
            default:
                return false;
        }
    }
}
