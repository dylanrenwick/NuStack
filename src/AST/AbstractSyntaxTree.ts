import { ProgramASTNode } from "./ProgramASTNode";

export class AbstractSyntaxTree {
    public root: ProgramASTNode;

    public constructor(rootNode: ProgramASTNode) {
        if (!(rootNode instanceof ProgramASTNode)) {
            throw new Error("Invalid root node");
        }
        this.root = rootNode;
    }
}
