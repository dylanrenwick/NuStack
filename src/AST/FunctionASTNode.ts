import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class FunctionASTNode implements IASTNode {
    private subName: string;
    private return: string;
    private children: StatementASTNode[];

    public get childNodes(): StatementASTNode[] { return this.children; }
    public get name(): string { return this.subName; }
    public get returnType(): string { return this.return; }

    public constructor(name: string, returnType: string, children: StatementASTNode[]) {
        this.subName = name;
        this.return = returnType;
        this.children = children;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("Sub '" + this.subName + "' [" + this.return + "]");

        for (let statement of this.children) {
            sb = statement.toString(sb);
        }

        sb.endBlock();
        return sb;
    }
}
