import { Declaration } from "../Declaration";
import { HashMap } from "../HashMap";
import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { AssignmentASTNode } from "./AssignmentASTNode";
import { ConstantASTNode } from "./ConstantASTNode";
import { DeclarationASTNode } from "./DeclarationASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { ProgramASTNode } from "./ProgramASTNode";
import { ReturnStatementASTNode } from "./ReturnStatementASTNode";
import { StatementASTNode } from "./StatementASTNode";
import { SubroutineASTNode } from "./SubroutineASTNode";

export class ConstantFolder {
    private static variables: HashMap<string, Declaration> = new HashMap<string, Declaration>();

    public static SimplifyTree(ast: AbstractSyntaxTree): AbstractSyntaxTree {
        ast.root = new ProgramASTNode(this.simplifySubroutine(ast.root.childNodes));
        return ast;
    }

    private static simplifySubroutine(sub: SubroutineASTNode): SubroutineASTNode {
        return new SubroutineASTNode(
            sub.name, sub.returnType,
            sub.childNodes.map(x => this.simplifyStatement(x))
        );
    }

    private static simplifyStatement(statement: StatementASTNode): StatementASTNode {
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

    private static simplifyExpression(expr: ExpressionASTNode): ExpressionASTNode {
        if (expr.expressionValue !== null) {
            return new ConstantASTNode(expr.expressionValue);
        }

        return expr;
    }
}
