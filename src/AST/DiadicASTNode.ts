import { ExpressionASTNode, ITypeDef } from "./ExpressionASTNode";
import { OperationASTNode, OperationType } from "./OperationASTNode";

export class DiadicASTNode extends OperationASTNode {
    private leftOperand: ExpressionASTNode;
    private rightOperand: ExpressionASTNode;

    public get childNodes(): ExpressionASTNode[] { return [this.leftOperand, this.rightOperand]; }
    public get expressionValue(): any {
        if (this.leftOperand.expressionValue !== null
            && this.rightOperand.expressionValue !== null) {
            return OperationASTNode.applyOperator(this.opType, [
                this.leftOperand.expressionValue,
                this.rightOperand.expressionValue
            ]);
        }

        return null;
    }
    public get expressionType(): ITypeDef {
        return OperationASTNode.getOperatorType(this.opType, this.leftOperand.expressionType);
    }

    public constructor(opType: OperationType, leftOperand: ExpressionASTNode, rightOperand: ExpressionASTNode) {
        super(opType);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }
}
