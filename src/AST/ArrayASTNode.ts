import { ArrayValue } from "../ArrayValue";
import { ExpressionASTNode, ValueType } from "./ExpressionASTNode";

export class ArrayASTNode extends ExpressionASTNode {
    private arr: ArrayValue;

    public get expressionValue(): any { return null; }
    public get expressionType(): ValueType { return this.arr.type; }
    public get arraySize(): number { return this.arr.size; }
    public get array(): ArrayValue { return this.arr; }

    public constructor(array: ArrayValue) {
        super();
        this.arr = array;
    }
}
