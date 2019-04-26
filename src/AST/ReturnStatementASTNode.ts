import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class ReturnStatementASTNode extends StatementASTNode {
    private returnValue: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode { return this.returnValue; }

    public constructor(returnValue: ExpressionASTNode) {
        super();
        this.returnValue = returnValue;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("Return");
        sb = this.returnValue.toString(sb);
        sb.endBlock();

        return sb;
    }
}
