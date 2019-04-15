import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { ExpressionASTNode } from "./AST/ExpressionASTNode";
import { OperationASTNode, OperationType } from "./AST/OperationASTNode";
import { ReturnStatementASTNode } from "./AST/ReturnStatementASTNode";
import { StatementASTNode } from "./AST/StatementASTNode";
import { SubroutineASTNode } from "./AST/SubroutineASTNode";

export class AssemblyGenerator {
    public static generate(ast: AbstractSyntaxTree): string {
        let asm: string = "";

        asm += this.generateSubroutine(ast.root.childNodes);

        return asm;
    }

    private static generateSubroutine(sub: SubroutineASTNode): string {
        let asm: string = "";

        asm += sub.name + ":\n";

        for (let statement of sub.childNodes) {
            asm += this.generateStatement(statement);
        }

        return asm;
    }

    private static generateStatement(statement: StatementASTNode): string {
        if (statement instanceof ReturnStatementASTNode) {
            return this.generateReturn(statement);
        }

        throw new Error("Unknown AST node");
    }

    private static generateReturn(statement: ReturnStatementASTNode): string {
        return ((statement.childNodes !== null)
            ? this.generateExpression(statement.childNodes)
            : "")
            + "ret\n";
    }

    private static generateExpression(expr: ExpressionASTNode): string {
        if (expr instanceof ConstantASTNode) {
            return this.generateConstant(expr);
        } else if (expr instanceof OperationASTNode) {
            return this.generateOperation(expr);
        }

        throw new Error("Unknown AST node");
    }

    private static generateConstant(expr: ConstantASTNode): string {
        return "mov eax, " + expr.expressionValue + "d\n";
    }

    private static generateOperation(op: OperationASTNode): string {
        if (op.expressionValue !== null) {
            return this.generateConstant(new ConstantASTNode(
                op.expressionValue
            ));
        }

        let asm: string = "";

        switch (op.operation) {
            case OperationType.Negation:
                asm += this.generateExpression(op.childNodes);
                asm += "neg eax\n";
                break;
            case OperationType.BitwiseNOT:
                asm += this.generateExpression(op.childNodes);
                asm += "not eax\n";
                break;
            case OperationType.LogicalNOT:
                asm += this.generateExpression(op.childNodes);
                asm += "cmp eax, 0\n";
                asm += "xor eax, eax\n";
                asm += "setz al\n";
        }

        return asm;
    }
}
