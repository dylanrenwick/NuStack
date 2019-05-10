import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class IfASTNode extends StatementASTNode {
    private cond: ExpressionASTNode;
    private block: StatementASTNode[];
    private eBlock: StatementASTNode[];

    public get condition(): ExpressionASTNode { return this.cond; }
    public get ifBlock(): StatementASTNode[] { return this.block; }
    public get elseBlock(): StatementASTNode[] | null { return this.eBlock; }
    public get childNodes(): StatementASTNode[] {
        return this.elseBlock === null
            ? this.block
            : this.block.concat(this.elseBlock);
    }

    public constructor(cond: ExpressionASTNode, block: StatementASTNode[], eBlock?: StatementASTNode[]) {
        super();
        this.cond = cond;
        this.block = block;
        this.eBlock = eBlock;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("If");
        sb = this.cond.toString(sb);

        for (let statement of this.block) {
            sb = statement.toString(sb);
        }

        sb.endBlock();

        if (this.elseBlock !== null) {
            sb.startBlock("Else");

            for (let statement of this.elseBlock) {
                sb = statement.toString(sb);
            }

            sb.endBlock();
        }

        return sb;
    }
}
