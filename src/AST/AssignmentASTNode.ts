import { Declaration } from "../Declaration";
import { DiadicASTNode } from "./DiadicASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { OperationType } from "./OperationASTNode";
import { VariableASTNode } from "./VariableASTNode";

export class AssignmentASTNode extends DiadicASTNode {
    public get declaration(): Declaration {
        return (this.childNodes[0] as VariableASTNode).declaration;
    }
    public get expression(): ExpressionASTNode {
        return this.childNodes[1];
    }

    public constructor(dec: Declaration, expr: ExpressionASTNode) {
        super(OperationType.Assignment, new VariableASTNode(dec), expr);
    }
}
