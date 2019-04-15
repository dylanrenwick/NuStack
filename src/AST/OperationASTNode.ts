import { ConstantASTNode } from "./ConstantASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";

export class OperationASTNode extends ExpressionASTNode {
    private operand: ExpressionASTNode;
    private opType: OperationType;

    public get operation(): OperationType { return this.opType; }
    public get childNodes(): ExpressionASTNode { return this.operand; }
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
        super();
        this.opType = type;
        this.operand = operand;
    }
}

export enum OperationType {
    Negation,
    BitwiseNOT,
    LogicalNOT,
}
