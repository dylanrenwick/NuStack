import { ExpressionASTNode, ValueType } from "./AST/ExpressionASTNode";

export class Declaration {
    private varName: string;
    private type: ValueType;
    private values: any[];
    private hasRefs: boolean[];

    public get variableName(): string { return this.varName; }
    public get currentIndex(): number { return this.values.length - 1; }
    public get currentValue(): any { return this.values[this.currentIndex]; }
    public get variableType(): ValueType { return this.type; }
    public get wasReferenced(): boolean { return this.hasRefs.reduce((a, b) => a || b); }

    public constructor(varName: string, type: string) {
        this.varName = varName;
        this.type = ExpressionASTNode.getTypeFromString(type);
        this.values = [];
        this.hasRefs = [];
    }

    public getValue(index: number): any {
        return this.values[index];
    }

    public addValue(value: any): number {
        if (this.typeCheck(value)) {
            this.values.push(value);
            this.hasRefs.push(false);
            return this.values.length - 1;
        } else {
            throw new Error("Variable " + this.varName + " is of type "
                + this.type + " but value given was of type " + typeof(value));
        }
    }

    public flagRef(index: number = this.currentIndex): void {
        this.hasRefs[index] = true;
    }
    public hasRef(index: number = this.currentIndex): boolean {
        return this.hasRefs[index];
    }

    private typeCheck(value: any): boolean {
        if (value === null) return true;
        switch (this.type) {
            case ValueType.int:
                return typeof(value) === "number" && (value as number) % 1 === 0;
            default:
                return false;
        }
    }
}
