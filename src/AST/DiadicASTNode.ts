import { ExpressionASTNode } from "./ExpressionASTNode";
import { OperationASTNode, OperationType } from "./OperationASTNode";

export class DiadicASTNode extends OperationASTNode {
    private leftOperand: ExpressionASTNode;
    private rightOperand: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode[] { return [this.leftOperand, this.rightOperand]; }
    public get expressionValue(): any { return null; }

    public constructor(opType: OperationType, leftOperand: ExpressionASTNode, rightOperand: ExpressionASTNode) {
        super(opType);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }
}
