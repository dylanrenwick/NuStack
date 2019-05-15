import { ArrayValue } from "./ArrayValue";
import { ExpressionASTNode, ITypeDef, ValueType } from "./AST/ExpressionASTNode";

export class Declaration {
    private varName: string;
    private type: ITypeDef;
    private values: any[];

    public get variableName(): string { return this.varName; }
    public get currentIndex(): number { return this.values.length - 1; }
    public get currentValue(): any { return this.values[this.currentIndex]; }
    public get variableType(): ITypeDef { return this.type; }
    public get isArray(): boolean { return this.type.isArray; }

    public constructor(varName: string, type: string | ITypeDef) {
        this.varName = varName;
        if (typeof(type) !== "string") this.type = type;
        else this.type = ExpressionASTNode.getTypeFromString(type);
        this.values = [];
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
            return value instanceof ArrayValue && value.type === this.type.type;
        }
        switch (this.type.type) {
            case ValueType.int:
                return typeof(value) === "number" && (value as number) % 1 === 0;
            default:
                return false;
        }
    }
}
