import { IASTNode } from "./IASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class SubroutineASTNode implements IASTNode {
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
}
