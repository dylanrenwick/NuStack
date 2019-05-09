import { ExpressionASTNode, ValueType } from "./ExpressionASTNode";
import { OperationASTNode, OperationType } from "./OperationASTNode";

export class MonadicASTNode extends OperationASTNode {
    private operand: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode[] { return [this.operand]; }
    public get expressionValue(): any {
        if (this.operand.expressionValue !== null) {
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
    public get expressionType(): ValueType {
        return this.operand.expressionType;
    }

    public constructor(type: OperationType, operand: ExpressionASTNode) {
        super(type);
        this.operand = operand;
    }
}
