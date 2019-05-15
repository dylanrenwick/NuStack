import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ITypeDef, ValueType } from "./ExpressionASTNode";

export abstract class OperationASTNode extends ExpressionASTNode {
    protected opType: OperationType;

    public get operation(): OperationType { return this.opType; }
    public abstract get childNodes(): ExpressionASTNode[];

    public constructor(type: OperationType) {
        super();
        this.opType = type;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("Operation [" + OperationType[this.opType] + "]");

        for (let operand of this.childNodes) {
            sb = operand.toString(sb);
        }

        sb.endBlock(this.expressionValue === null ? "" : " = " + this.expressionValue);
        return sb;
    }

    public static applyOperator(op: OperationType, operands: number[]): number {
        let ret = null;
        switch (op) {
            case OperationType.Negation: ret = -operands[0]; break;
            case OperationType.BitwiseNOT: ret = ~operands[0]; break;
            case OperationType.LogicalNOT: ret = operands[0] === 0 ? 0 : 1; break;
            case OperationType.Addition: ret = operands[0] + operands[1]; break;
            case OperationType.Subtraction: ret = operands[0] - operands[1]; break;
            case OperationType.Multiplication: ret = operands[0] * operands[1]; break;
            case OperationType.Division: ret = operands[0] / operands[1]; break;
            case OperationType.LessThan: ret = operands[0] < operands[1]; break;
            case OperationType.MoreThan: ret = operands[0] > operands[1]; break;
            case OperationType.Equal: ret = operands[0] === operands[1]; break;
            case OperationType.NotEqual: ret = operands[0] !== operands[1]; break;
            case OperationType.MoreThanEqual: ret = operands[0] >= operands[1]; break;
            case OperationType.LessThanEqual: ret = operands[0] <= operands[1]; break;
            case OperationType.LogicalOR: ret = operands[0] | operands[1]; break;
            case OperationType.LogicalAND: ret = operands[0] & operands[1]; break;
        }

        if (typeof(ret) === "boolean") ret = ret ? 1 : 0;
        if (Number.isNaN(ret)) ret = null;

        return ret;
    }

    public static getOperatorType(op: OperationType, on: ITypeDef): ITypeDef {
        switch (op) {
            case OperationType.LessThan:
            case OperationType.MoreThan:
            case OperationType.Equal:
            case OperationType.NotEqual:
            case OperationType.MoreThanEqual:
            case OperationType.LessThanEqual:
            case OperationType.LogicalOR:
            case OperationType.LogicalAND:
                return {
                    isArray: false,
                    type: ValueType.bool
                };
            case OperationType.Negation:
            case OperationType.BitwiseNOT:
            case OperationType.LogicalNOT:
            case OperationType.Addition:
            case OperationType.Subtraction:
            case OperationType.Multiplication:
            case OperationType.Division:
            default:
                return on;
        }
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
    LogicalAND,
    Assignment
}
