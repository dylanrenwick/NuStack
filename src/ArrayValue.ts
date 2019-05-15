import { ExpressionASTNode, ValueType } from "./AST/ExpressionASTNode";

export class ArrayValue {
    private valType: ValueType;
    private arrSize: number;
    private arrVal: any;

    public get type(): ValueType { return this.valType; }
    public get size(): number { return this.arrSize; }
    public get value(): any[] { return this.arrVal; }

    public constructor(type: string | ValueType, size: number, value?: any) {
        this.arrSize = size;
        this.valType = typeof(type) === "string"
            ? ExpressionASTNode.getTypeFromString(type).type
            : type;
        if (typeof(value) === "string") value = value.split("");
        this.arrVal = value;
    }
}
