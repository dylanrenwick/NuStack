import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";

export class VariableASTNode extends ExpressionASTNode {
    private var: Declaration;

    public get expressionValue(): any { return null; }

    public constructor(dec: Declaration) {
        super();
        this.var = dec;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Variable: '" + this.var.variableName + "' [" + this.var.variableType + "]");
        return sb;
    }
}
