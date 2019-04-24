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
    MoreThan,
    LessThan,
    Equal,
    NotEqual,
    MoreThanEqual,
    LessThanEqual,
    LogicalOR,
    LogicalAND
}

export function applyOperator(op: OperationType, operands: number[]): any {
    switch (op) {
        case OperationType.Negation: return -operands[0];
        case OperationType.BitwiseNOT: return ~operands[0];
        case OperationType.LogicalNOT: return operands[0] === 0 ? 0 : 1;
        case OperationType.Addition: return operands[0] + operands[1];
        case OperationType.Subtraction: return operands[0] - operands[1];
        case OperationType.Multiplication: return operands[0] * operands[1];
        case OperationType.Division: return operands[0] / operands[1];
        case OperationType.LessThan: return operands[0] < operands[1];
        case OperationType.MoreThan: return operands[0] > operands[1];
        case OperationType.Equal: return operands[0] === operands[1];
        case OperationType.NotEqual: return operands[0] !== operands[1];
        case OperationType.LessThanEqual: return operands[0] <= operands[1];
        case OperationType.MoreThanEqual: return operands[0] >= operands[1];
        default: return null;
    }
}
