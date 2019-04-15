import { ExpressionASTNode } from "./ExpressionASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class ReturnStatementASTNode extends StatementASTNode {
	private returnValue: ExpressionASTNode;

	public get childNodes(): ExpressionASTNode { return this.returnValue; }

	public constructor(returnValue: ExpressionASTNode) {
		super();
		this.returnValue = returnValue;
	}
}
