import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ITypeDef } from "./ExpressionASTNode";

export class VariableASTNode extends ExpressionASTNode {
    private dec: Declaration;
    private index: ExpressionASTNode;

    public get declaration(): Declaration { return this.dec; }
    public get expressionValue(): any { return this.dec.currentValue; }
    public get expressionType(): ITypeDef {
        return this.index !== null && this.index !== undefined
            ? { isArray: false, type: this.dec.variableType.type }
            : this.dec.variableType;
    }
    public get isArray(): boolean { return this.dec.isArray; }
    public get arrayIndex(): ExpressionASTNode { return this.index; }

    public constructor(dec: Declaration, index?: ExpressionASTNode) {
        super();
        this.dec = dec;
        this.index = index;
    }

    public toString(sb: StringBuilder): StringBuilder {
        if (this.isArray) {
            sb.startBlock("Variable: '" + `${this.dec.variableName}' [${this.dec.variableType}]`);
            sb = this.index.toString(sb);
            sb.endBlock();
        } else {
            sb.appendLine("Variable: '" + `${this.dec.variableName}' [${this.dec.variableType}]`);
        }
        return sb;
    }
}
