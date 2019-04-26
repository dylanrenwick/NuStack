import { Declaration } from "../Declaration";
import { DiadicASTNode } from "./DiadicASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { OperationType } from "./OperationASTNode";
import { VariableASTNode } from "./VariableASTNode";

export class AssignmentASTNode extends DiadicASTNode {
    public constructor(dec: Declaration, expr: ExpressionASTNode) {
        super(OperationType.Assignment, new VariableASTNode(dec), expr);
    }
}
