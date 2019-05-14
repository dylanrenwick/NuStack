import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class LoopASTNode extends StatementASTNode {
    private cond: ExpressionASTNode;
    private children: StatementASTNode[];

    public get condition(): ExpressionASTNode { return this.cond; }
    public get childNodes(): StatementASTNode[] { return this.children; }

    public constructor(cond: ExpressionASTNode, children: StatementASTNode[]) {
        super();
        this.cond = cond;
        this.children = children;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("While");
        sb = this.cond.toString(sb);

        for (let statement of this.children) {
            sb = statement.toString(sb);
        }

        sb.endBlock();
        return sb;
    }
}
