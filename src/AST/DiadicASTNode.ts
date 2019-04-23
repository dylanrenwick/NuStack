import { ConstantASTNode } from "./ConstantASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { OperationASTNode, OperationType } from "./OperationASTNode";

export class DiadicASTNode extends OperationASTNode {
    private leftOperand: ExpressionASTNode;
    private rightOperand: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode[] { return [this.leftOperand, this.rightOperand]; }
    public get expressionValue(): any {
        if (this.leftOperand.expressionValue !== null
            && this.rightOperand.expressionValue !== null) {
            switch (this.opType) {
                case OperationType.Addition:
                    return this.leftOperand.expressionValue + this.rightOperand.expressionValue;
                case OperationType.Subtraction:
                    return this.leftOperand.expressionValue - this.rightOperand.expressionValue;
                case OperationType.Multiplication:
                    return this.leftOperand.expressionValue * this.rightOperand.expressionValue;
                case OperationType.Division:
                    return this.leftOperand.expressionValue / this.rightOperand.expressionValue;
                case OperationType.LessThan:
                    return this.leftOperand.expressionValue < this.rightOperand.expressionValue;
                case OperationType.MoreThan:
                    return this.leftOperand.expressionValue > this.rightOperand.expressionValue;
                case OperationType.Equal:
                    return this.leftOperand.expressionValue === this.rightOperand.expressionValue;
                case OperationType.NotEqual:
                    return this.leftOperand.expressionValue !== this.rightOperand.expressionValue;
                case OperationType.LessThanEqual:
                    return this.leftOperand.expressionValue <= this.rightOperand.expressionValue;
                case OperationType.MoreThanEqual:
                    return this.leftOperand.expressionValue >= this.rightOperand.expressionValue;
            }
        }

        return null;
    }

    public constructor(opType: OperationType, leftOperand: ExpressionASTNode, rightOperand: ExpressionASTNode) {
        super(opType);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }
}
