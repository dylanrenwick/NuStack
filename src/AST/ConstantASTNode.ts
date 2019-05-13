import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ValueType } from "./ExpressionASTNode";

export class ConstantASTNode extends ExpressionASTNode {
    private value: any;
    private type: ValueType;

    public get expressionValue(): any { return this.value; }
    public get expressionType(): ValueType { return this.type; }

    public constructor(value: any, type: string | ValueType) {
        super();
        this.value = value;
        this.type = typeof(type) === "string"
            ? ExpressionASTNode.getTypeFromString(type)
            : type;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Constant: " + this.value);
        return sb;
    }
}
