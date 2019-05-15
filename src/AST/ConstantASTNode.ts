import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ITypeDef, ValueType } from "./ExpressionASTNode";

export class ConstantASTNode extends ExpressionASTNode {
    private value: any;
    private type: ValueType;

    public get expressionValue(): any { return this.value; }
    public get expressionType(): ITypeDef { return { isArray: false, isPtr: false, type: this.type }; }

    public constructor(value: any, type: string | ValueType) {
        super();
        this.value = value;
        this.type = typeof(type) === "string"
            ? ExpressionASTNode.getTypeFromString(type).type
            : type;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Constant: " + this.value);
        return sb;
    }
}
