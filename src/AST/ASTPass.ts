import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { ProgramASTNode } from "./ProgramASTNode";
import { StatementASTNode } from "./StatementASTNode";
import { SubroutineASTNode } from "./SubroutineASTNode";

export abstract class ASTPass {
    public SimplifyTree(ast: AbstractSyntaxTree): AbstractSyntaxTree {
        ast.root = new ProgramASTNode(this.simplifySubroutine(ast.root.childNodes));
        return ast;
    }

    protected simplifySubroutine(sub: SubroutineASTNode): SubroutineASTNode {
        return new SubroutineASTNode(
            sub.name, sub.returnType,
            sub.childNodes.map(x => this.simplifyStatement(x))
        );
    }

    protected abstract simplifyStatement(statement: StatementASTNode): StatementASTNode;
    protected abstract simplifyExpression(expr: ExpressionASTNode): ExpressionASTNode;
}
