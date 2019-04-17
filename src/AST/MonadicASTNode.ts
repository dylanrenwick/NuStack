import { ConstantASTNode } from "./ConstantASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { OperationASTNode, OperationType } from "./OperationASTNode";

export class MonadicASTNode extends OperationASTNode {
    private operand: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode[] { return [this.operand]; }
    public get expressionValue(): any {
        if (this.operand instanceof ConstantASTNode) {
            switch (this.opType) {
                case OperationType.Negation:
                    return -this.operand.expressionValue;
                case OperationType.BitwiseNOT:
                    return ~this.operand.expressionValue;
                case OperationType.LogicalNOT:
                    return this.operand.expressionValue
                        ? 1
                        : 0;
            }
        }

        return null;
    }

    public constructor(type: OperationType, operand: ExpressionASTNode) {
        super(type);
        this.operand = operand;
    }
}