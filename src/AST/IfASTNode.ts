import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class IfASTNode extends StatementASTNode {
    private cond: ExpressionASTNode;
    private block: StatementASTNode[];
    private elseBlock: StatementASTNode[];

    public get childNodes(): StatementASTNode[] {
        return this.elseBlock === null
            ? this.block
            : this.block.concat(this.elseBlock);
    }

    public constructor(cond: ExpressionASTNode, block: StatementASTNode[], elseBlock?: StatementASTNode[]) {
        super();
        this.cond = cond;
        this.block = block;
        this.elseBlock = elseBlock;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("If (" + this.cond + ")");

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
