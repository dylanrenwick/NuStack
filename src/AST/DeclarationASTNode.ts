import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class DeclarationASTNode extends StatementASTNode {
    private dec: Declaration;
    private expr: ExpressionASTNode;

    public get declaration(): Declaration { return this.dec; }
    public get expression(): ExpressionASTNode { return this.expr; }

    public constructor(dec: Declaration, expr?: ExpressionASTNode) {
        super();
        this.dec = dec;
        this.expr = expr;
    }

    public toString(sb: StringBuilder): StringBuilder {
        if (!this.expr) sb.appendLine("Declare: '" + this.dec.variableName + "' [" + this.dec.variableType + "]");
        else {
            sb.startBlock("Declare: '" + this.dec.variableName + "' [" + this.dec.variableType + "]");
            sb = this.expr.toString(sb);
            sb.endBlock();
        }
        return sb;
    }
}
