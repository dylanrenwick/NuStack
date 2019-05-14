import { ArrayValue } from "./ArrayValue";
import { ExpressionASTNode, ValueType } from "./AST/ExpressionASTNode";

export class Declaration {
    private varName: string;
    private type: ValueType;
    private values: any[];
    private array: boolean;

    public get variableName(): string { return this.varName; }
    public get currentIndex(): number { return this.values.length - 1; }
    public get currentValue(): any { return this.values[this.currentIndex]; }
    public get variableType(): ValueType { return this.type; }
    public get isArray(): boolean { return this.array; }

    public constructor(varName: string, type: string, isArray: boolean = false) {
        this.varName = varName;
        this.type = ExpressionASTNode.getTypeFromString(type);
        this.values = [];
        this.array = isArray;
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
        if (value === null) return true;
        if (this.isArray) {
            return value instanceof ArrayValue && value.type === this.type;
        }
        switch (this.type) {
            case ValueType.int:
                return typeof(value) === "number" && (value as number) % 1 === 0;
            default:
                return false;
        }
    }
}
