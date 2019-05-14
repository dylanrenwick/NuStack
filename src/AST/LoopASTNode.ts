import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class LoopASTNode extends StatementASTNode {
    private before: StatementASTNode[];
    private after: StatementASTNode[];
    private cond: ExpressionASTNode;
    private children: StatementASTNode[];

    public get condition(): ExpressionASTNode { return this.cond; }
    public get beforeNodes(): StatementASTNode[] { return this.before; }
    public get afterNodes(): StatementASTNode[] { return this.after; }
    public get childNodes(): StatementASTNode[] {
        return this.children.concat(this.after);
    }

    public constructor(cond: ExpressionASTNode, children: StatementASTNode[],
                       before?: StatementASTNode[], after?: StatementASTNode[]
    ) {
        super();
        this.cond = cond;
        this.children = children;
        this.before = before || [];
        this.after = after || [];
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
