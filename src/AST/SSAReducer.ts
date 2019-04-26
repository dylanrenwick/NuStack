import { Declaration } from "../Declaration";
import { HashMap } from "../HashMap";
import { AssignmentASTNode } from "./AssignmentASTNode";
import { ASTPass } from "./ASTPass";
import { DeclarationASTNode } from "./DeclarationASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { OperationASTNode } from "./OperationASTNode";
import { ReturnStatementASTNode } from "./ReturnStatementASTNode";
import { StatementASTNode } from "./StatementASTNode";
import { SubroutineASTNode } from "./SubroutineASTNode";
import { VariableASTNode } from "./VariableASTNode";

export class SSAReducer extends ASTPass {
    private variables: HashMap<string, Declaration> = new HashMap<string, Declaration>();
    private scanIndices: HashMap<string, number> = new HashMap<string, number>();

    protected simplifySubroutine(sub: SubroutineASTNode): SubroutineASTNode {
        return new SubroutineASTNode(
            sub.name, sub.returnType,
            sub.childNodes
                .map(x => this.scanStatement(x))
                .map(x => this.simplifyStatement(x))
                .filter(x => x !== null)
        );
    }

    protected scanStatement(statement: StatementASTNode): StatementASTNode {
        if (statement instanceof DeclarationASTNode) {
            if (!this.variables.Has(statement.declaration.variableName)) {
                this.variables.Add(statement.declaration.variableName, statement.declaration);
            }
        } else if (statement instanceof ReturnStatementASTNode) {
            return new ReturnStatementASTNode(this.scanExpression(statement.childNodes));
        } else if (statement instanceof AssignmentASTNode) {
            let dec: Declaration = statement.declaration;
            if (statement.expression.expressionValue !== null) {
                dec.addValue(statement.expression.expressionValue);
                statement = new AssignmentASTNode(dec,
                    this.scanExpression(statement.expression)
                );
            }
        }

        return statement;
    }

    protected scanExpression(expr: ExpressionASTNode): ExpressionASTNode {
        if (expr instanceof VariableASTNode) {
            let dec: Declaration = expr.declaration;
            dec.flagRef();
        } else if (expr instanceof OperationASTNode) {
            for (let subExpr of expr.childNodes) {
                this.simplifyExpression(subExpr);
            }
        }

        return expr;
    }

    protected simplifyStatement(statement: StatementASTNode): StatementASTNode {
        if (statement instanceof DeclarationASTNode) {
            if (!statement.declaration.wasReferenced) return null;
            else this.scanIndices.Add(statement.declaration.variableName, 0);
        } else if (statement instanceof ReturnStatementASTNode) {
            return new ReturnStatementASTNode(this.simplifyExpression(statement.childNodes));
        } else if (statement instanceof AssignmentASTNode) {
            let dec: Declaration = statement.declaration;
            this.scanIndices.Add(dec.variableName, this.scanIndices.Get(dec.variableName));
            if (!dec.hasRef(this.scanIndices.Get(dec.variableName))) {
                return null;
            }
        }

        return statement;
    }

    protected simplifyExpression(expr: ExpressionASTNode): ExpressionASTNode {
        return expr;
    }
}
