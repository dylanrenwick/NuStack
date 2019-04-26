import { StringBuilder } from "../StringBuilder";
import { ProgramASTNode } from "./ProgramASTNode";

export class AbstractSyntaxTree {
    public root: ProgramASTNode;

    public constructor(rootNode: ProgramASTNode) {
        this.root = rootNode;
    }

    public toString(): string {
        let sb: StringBuilder = new StringBuilder();
        sb = this.root.toString(sb);

        return sb.toString();
    }
}
