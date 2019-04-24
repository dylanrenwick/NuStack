import { ExpressionASTNode } from "./ExpressionASTNode";
import { applyOperator, OperationASTNode, OperationType } from "./OperationASTNode";

export class DiadicASTNode extends OperationASTNode {
    private leftOperand: ExpressionASTNode;
    private rightOperand: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode[] { return [this.leftOperand, this.rightOperand]; }
    public get expressionValue(): any {
        if (this.leftOperand.expressionValue !== null
            && this.rightOperand.expressionValue !== null) {
            return applyOperator(this.opType, [this.leftOperand.expressionValue, this.rightOperand.expressionValue]);
        }

        return null;
    }

    public constructor(opType: OperationType, leftOperand: ExpressionASTNode, rightOperand: ExpressionASTNode) {
        super(opType);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }
}
