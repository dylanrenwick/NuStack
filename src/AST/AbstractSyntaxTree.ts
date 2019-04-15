import { ProgramASTNode } from "./ProgramASTNode";

export class AbstractSyntaxTree {
	public root: ProgramASTNode;

	public constructor(rootNode: ProgramASTNode) {
		this.root = rootNode;
	}
}
