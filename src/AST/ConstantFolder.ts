import { Declaration } from "../Declaration";
import { HashMap } from "../HashMap";
import { AssignmentASTNode } from "./AssignmentASTNode";
import { ASTPass } from "./ASTPass";
import { ConstantASTNode } from "./ConstantASTNode";
import { DeclarationASTNode } from "./DeclarationASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { ReturnStatementASTNode } from "./ReturnStatementASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class ConstantFolder extends ASTPass {
    private variables: HashMap<string, Declaration> = new HashMap<string, Declaration>();

    protected simplifyStatement(statement: StatementASTNode): StatementASTNode {
        if (statement instanceof ReturnStatementASTNode) {
            return new ReturnStatementASTNode(this.simplifyExpression(statement.childNodes));
        } else if (statement instanceof DeclarationASTNode) {
            let dec: Declaration = statement.declaration;
            if (this.variables.Has(dec.variableName)) {
                throw new Error("Attempt to declare varable '"
                    + dec.variableName + "' [" + dec.variableType
                    + "] but variable was already declared");
            }
            dec.addValue(null);
            this.variables.Add(dec.variableName, dec);
        } else if (statement instanceof AssignmentASTNode) {
            let dec: Declaration = statement.declaration;
            if (statement.expression.expressionValue !== null) {
                dec.addValue(statement.expression.expressionValue);
                statement = new AssignmentASTNode(dec,
                    this.simplifyExpression(statement.expression)
                );
            }
        }

        return statement;
    }

    protected simplifyExpression(expr: ExpressionASTNode): ExpressionASTNode {
        if (expr.expressionValue !== null) {
            return new ConstantASTNode(expr.expressionValue);
        }

        return expr;
    }
}
