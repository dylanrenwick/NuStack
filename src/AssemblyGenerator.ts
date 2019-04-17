import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { ExpressionASTNode } from "./AST/ExpressionASTNode";
import { OperationASTNode, OperationType } from "./AST/OperationASTNode";
import { ReturnStatementASTNode } from "./AST/ReturnStatementASTNode";
import { StatementASTNode } from "./AST/StatementASTNode";
import { SubroutineASTNode } from "./AST/SubroutineASTNode";

export class AssemblyGenerator {
    private static complexOps: OperationType[] = [
        OperationType.LogicalOR, OperationType.LogicalAND
    ];

    private static diadicOps: OperationType[] = [
        OperationType.Equal, OperationType.NotEqual,
        OperationType.MoreThanEqual, OperationType.LessThanEqual,
        OperationType.MoreThan, OperationType.LessThan,
        OperationType.Addition, OperationType.Subtraction,
        OperationType.Multiplication, OperationType.Division
    ];

    private static comparisons: OperationType[] = [
        OperationType.Equal, OperationType.NotEqual,
        OperationType.MoreThanEqual, OperationType.LessThanEqual,
        OperationType.MoreThan, OperationType.LessThan
    ];

    private static labelCount: number = 1;

    private static get label(): string { return "_util_label" + this.labelCount++; }

    public static generate(ast: AbstractSyntaxTree): string {
        let asm: string = "";

        asm += this.generateSubroutine(ast.root.childNodes);

        return asm;
    }

    private static generateSubroutine(sub: SubroutineASTNode): string {
        let asm: string = "";

        asm += sub.name + ":\n";
        asm += "push ebp\n";
        asm += "mov ebp, esp\n";

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
            + "mov esp, ebp\n"
            + "pop ebp\n"
            + "ret\n";
    }

    private static generateExpression(expr: ExpressionASTNode): string {
        if (expr instanceof ConstantASTNode) {
            return this.generateConstant(expr);
        } else if (expr instanceof OperationASTNode) {
            return this.generateOperation(expr);
        }

        throw new Error("Unknown AST node: " + JSON.stringify(expr));
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
                asm += this.generateExpression(op.childNodes[0]);
                asm += "neg eax\n";
                break;
            case OperationType.BitwiseNOT:
                asm += this.generateExpression(op.childNodes[0]);
                asm += "not eax\n";
                break;
            case OperationType.LogicalNOT:
                asm += this.generateExpression(op.childNodes[0]);
                asm += "cmp eax, 0\n";
                asm += "xor eax, eax\n";
                asm += "setz al\n";
                break;
        }

        if (this.diadicOps.includes(op.operation)) {
            asm += this.generateExpression(op.childNodes[0]);
            asm += "push eax\n";
            asm += this.generateExpression(op.childNodes[1]);
            asm += "pop ecx\n";
            switch (op.operation) {
                case OperationType.Addition:
                    asm += "add eax, ecx\n";
                    break;
                case OperationType.Subtraction:
                    asm += "sub eax, ecx\n";
                    break;
                case OperationType.Multiplication:
                    asm += "mul ecx\n";
                    break;
                case OperationType.Division:
                    asm += "xor edx, edx\n";
                    asm += "div ecx\n";
                    break;
            }

            if (this.comparisons.includes(op.operation)) {
                asm += "cmp eax, ecx\n";
                asm += "xor eax, eax\n";
                switch (op.operation) {
                    case OperationType.MoreThan:
                        asm += "setg al\n";
                        break;
                    case OperationType.LessThan:
                        asm += "setl al\n";
                        break;
                    case OperationType.Equal:
                        asm += "setz al\n";
                        break;
                    case OperationType.NotEqual:
                        asm += "setnz al\n";
                        break;
                    case OperationType.MoreThanEqual:
                        asm += "setge al\n";
                        break;
                    case OperationType.LessThanEqual:
                        asm += "setle al\n";
                        break;
                }
            }
        }

        if (this.complexOps.includes(op.operation)) {
            let clauseLabel = this.label;
            let endLabel = this.label;

            if (op.operation === OperationType.LogicalOR) {
                asm += this.generateExpression(op.childNodes[0]);
                asm += "cmp eax, 0\n";
                asm += "je " + clauseLabel + "\n";
                asm += "mov eax, 1d\n";
                asm += "jmp " + endLabel + "\n";
                asm += clauseLabel + ":\n";
                asm += this.generateExpression(op.childNodes[1]);
                asm += "cmp eax, 0\n";
                asm += "xor eax, eax\n";
                asm += "setne al\n";
                asm += endLabel + ":\n";
            } else if (op.operation === OperationType.LogicalAND) {
                asm += this.generateExpression(op.childNodes[0]);
                asm += "cmp eax, 0\n";
                asm += "jne " + clauseLabel + "\n";
                asm += "jmp " + endLabel + "\n";
                asm += clauseLabel + ":\n";
                asm += this.generateExpression(op.childNodes[1]);
                asm += "cmp eax, 0\n";
                asm += "xor eax, eax\n";
                asm += "setne al\n";
                asm += endLabel + ":\n";
            }
        }

        return asm;
    }
}
