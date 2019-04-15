import { ProgramASTNode } from "./ProgramASTNode";

export class AbstractSyntaxTree {
    private root: ProgramASTNode;

    public constructor(rootNode: ProgramASTNode) {
        this.root = rootNode;
    }
}