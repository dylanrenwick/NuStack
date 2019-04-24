import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { ConstantASTNode } from "./ConstantASTNode";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { ProgramASTNode } from "./ProgramASTNode";
import { ReturnStatementASTNode } from "./ReturnStatementASTNode";
import { StatementASTNode } from "./StatementASTNode";
import { SubroutineASTNode } from "./SubroutineASTNode";

export class ASTSimplifier {
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
