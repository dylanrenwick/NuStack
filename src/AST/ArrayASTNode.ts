import { ArrayValue } from "../ArrayValue";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ITypeDef } from "./ExpressionASTNode";

export class ArrayASTNode extends ExpressionASTNode {
    private arr: ArrayValue;

    public get expressionValue(): any { return null; }
    public get expressionType(): ITypeDef { return { isArray: true, type: this.arr.type }; }
    public get arraySize(): number { return this.arr.size; }
    public get array(): ArrayValue { return this.arr; }

    public constructor(array: ArrayValue) {
        super();
        this.arr = array;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine(`Array [Type: ${this.expressionType}, Size: ${this.arraySize}]`);
        return sb;
    }
}
