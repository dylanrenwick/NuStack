import { AbstractSyntaxTree } from "./AbstractSyntaxTree";
import { ExpressionASTNode } from "./ExpressionASTNode";
import { FunctionASTNode } from "./FunctionASTNode";
import { ProgramASTNode } from "./ProgramASTNode";
import { StatementASTNode } from "./StatementASTNode";

export abstract class ASTPass {
    public SimplifyTree(ast: AbstractSyntaxTree): AbstractSyntaxTree {
        ast.root = new ProgramASTNode(this.simplifyFunction(ast.root.childNodes));
        return ast;
    }

    protected simplifyFunction(sub: FunctionASTNode): FunctionASTNode {
        return new FunctionASTNode(
            sub.name, sub.returnType,
            sub.childNodes.map(x => this.simplifyStatement(x))
        );
    }

    protected abstract simplifyStatement(statement: StatementASTNode): StatementASTNode;
    protected abstract simplifyExpression(expr: ExpressionASTNode): ExpressionASTNode;
}
