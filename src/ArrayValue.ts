import { ExpressionASTNode, ValueType } from "./AST/ExpressionASTNode";

export class ArrayValue {
    private valType: ValueType;
    private arrSize: number;

    public get type(): ValueType { return this.valType; }
    public get size(): number { return this.arrSize; }

    public constructor(type: string | ValueType, size: number) {
        this.arrSize = size;
        this.valType = typeof(type) === "string"
            ? ExpressionASTNode.getTypeFromString(type)
            : type;
    }
}
