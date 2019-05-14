import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ValueType } from "./ExpressionASTNode";

export class VariableASTNode extends ExpressionASTNode {
    private dec: Declaration;
    private index: number;

    public get declaration(): Declaration { return this.dec; }
    public get expressionValue(): any { return this.dec.currentValue; }
    public get expressionType(): ValueType { return this.dec.variableType; }
    public get isArray(): boolean { return this.dec.isArray; }
    public get arrayIndex(): number { return this.index; }

    public constructor(dec: Declaration, index?: number) {
        super();
        this.dec = dec;
        this.index = index;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Variable: '"
            + `${this.dec.variableName}${this.isArray ? `:${this.index}` : ""}`
            + `' [${this.dec.variableType}]`
        );
        return sb;
    }
}
