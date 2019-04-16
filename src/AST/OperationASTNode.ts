import { ConstantASTNode } from "./ConstantASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";

export abstract class OperationASTNode extends ExpressionASTNode {
    protected opType: OperationType;

    public get operation(): OperationType { return this.opType; }
    public abstract get childNodes(): ExpressionASTNode[];

    public constructor(type: OperationType) {
        super();
        this.opType = type;
    }
}

export enum OperationType {
    Negation,
    BitwiseNOT,
    LogicalNOT,
    Addition,
    Subtraction,
    Multiplication,
    Division,
}
