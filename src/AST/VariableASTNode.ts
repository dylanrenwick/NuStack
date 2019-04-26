import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";

export class VariableASTNode extends ExpressionASTNode {
    private dec: Declaration;

    public get declaration(): Declaration { return this.dec; }
    public get expressionValue(): any { return this.dec.currentValue; }

    public constructor(dec: Declaration) {
        super();
        this.dec = dec;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Variable: '" + this.dec.variableName + "' [" + this.dec.variableType + "]");
        return sb;
    }
}
