import { Allocator } from "../Allocator";
import { AbstractSyntaxTree } from "../AST/AbstractSyntaxTree";
import { AssignmentASTNode } from "../AST/AssignmentASTNode";
import { ConstantASTNode } from "../AST/ConstantASTNode";
import { DeclarationASTNode } from "../AST/DeclarationASTNode";
import { ExpressionASTNode } from "../AST/ExpressionASTNode";
import { OperationASTNode, OperationType } from "../AST/OperationASTNode";
import { ReturnStatementASTNode } from "../AST/ReturnStatementASTNode";
import { StatementASTNode } from "../AST/StatementASTNode";
import { SubroutineASTNode } from "../AST/SubroutineASTNode";
import { VariableASTNode } from "../AST/VariableASTNode";
import { Declaration } from "../Declaration";
import { HashMap } from "../HashMap";
import { StringBuilder } from "../StringBuilder";
import { IPlatformController } from "./IPlatformController";

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

    private static stackMap: HashMap<string, number>;
    private static stackOffset: number;

    private static labelCount: number = 1;

    private static platformController: IPlatformController;

    private static get label(): string { return "_util_label" + this.labelCount++; }

    public static generate(ast: AbstractSyntaxTree, platform: IPlatformController): string {
        this.platformController = platform;
        let sb: StringBuilder = new StringBuilder();

        sb.appendLine("section .text");
        sb.appendLine("global _start");
        sb.appendLine("");
        sb.appendLine("_start:");
        sb.indent++;
        sb.appendLine("call main");
        sb.appendLine("mov rbx, rax");
        sb.appendLine("mov rax, 1");
        sb.appendLine("int 0x80");
        sb.appendLine("");

        sb = this.generateSubroutine(sb, ast.root.childNodes);

        return sb.toString();
    }

    private static generateSubroutine(sb: StringBuilder, sub: SubroutineASTNode): StringBuilder {
        sb = this.generateLabel(sb, sub.name);
        sb.appendLine("push rbp");
        sb.appendLine("mov rbp, rsp");

        this.stackMap = new HashMap<string, number>();
        this.stackOffset = 0;

        for (let statement of sub.childNodes) {
            sb = this.generateStatement(sb, statement);
        }

        return sb;
    }

    private static generateLabel(sb: StringBuilder, label: string): StringBuilder {
        sb.indent--;
        sb.appendLine(label + ":");
        sb.indent++;

        return sb;
    }

    private static generateStatement(sb: StringBuilder, statement: StatementASTNode): StringBuilder {
        if (statement instanceof ReturnStatementASTNode) {
            return this.generateReturn(sb, statement);
        } else if (statement instanceof DeclarationASTNode) {
            return this.generateDeclaration(sb, statement);
        } else if (statement instanceof AssignmentASTNode) {
            return this.generateExpression(sb, statement);
        }

        throw new Error("Unknown AST node");
    }

    private static generateReturn(sb: StringBuilder, statement: ReturnStatementASTNode): StringBuilder {
        if (statement.childNodes !== null) sb = this.generateExpression(sb, statement.childNodes);

        sb.appendLine("mov rsp, rbp");
        sb.appendLine("pop rbp");
        sb.appendLine("ret");

        return sb;
    }

    private static generateDeclaration(sb: StringBuilder, statement: DeclarationASTNode): StringBuilder {
        let dec: Declaration = statement.declaration;

        if (this.stackMap.Has(dec.variableName)) {
            throw new Error("Variable '" + dec.variableName + "' has already been declared!");
        }

        sb.appendLine("mov rax, 0d");
        sb.appendLine("push rax");

        this.stackOffset += 4;
        this.stackMap.Add(dec.variableName, this.stackOffset);

        return sb;
    }

    private static generateExpression(sb: StringBuilder, expr: ExpressionASTNode): StringBuilder {
        if (expr instanceof ConstantASTNode) {
            return this.generateConstant(sb, expr);
        } else if (expr instanceof AssignmentASTNode) {
            return this.generateAssignment(sb, expr);
        } else if (expr instanceof OperationASTNode) {
            return this.generateOperation(sb, expr);
        } else if (expr instanceof VariableASTNode) {
            return this.generateReference(sb, expr);
        }

        throw new Error("Unknown AST node: " + JSON.stringify(expr));
    }

    private static generateConstant(sb: StringBuilder, expr: ConstantASTNode): StringBuilder {
        sb.appendLine("mov rax, " + expr.expressionValue + "d");
        return sb;
    }

    private static generateOperation(sb: StringBuilder, op: OperationASTNode): StringBuilder {
        switch (op.operation) {
            case OperationType.Negation:
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("neg rax");
                break;
            case OperationType.BitwiseNOT:
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("not rax");
                break;
            case OperationType.LogicalNOT:
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("cmp rax, 0");
                sb.appendLine("xor rax, rax");
                sb.appendLine("setz al");
                break;
        }

        if (this.diadicOps.includes(op.operation)) {
            sb = this.generateExpression(sb, op.childNodes[0]);
            sb.appendLine("push rax");
            sb = this.generateExpression(sb, op.childNodes[1]);
            sb.appendLine("pop rcx");
            switch (op.operation) {
                case OperationType.Addition:
                    sb.appendLine("add rax, rcx");
                    break;
                case OperationType.Subtraction:
                    sb.appendLine("sub rax, rcx");
                    break;
                case OperationType.Multiplication:
                    sb.appendLine("mul rcx");
                    break;
                case OperationType.Division:
                    sb.appendLine("xor rdx, rdx");
                    sb.appendLine("div rcx");
                    break;
            }

            if (this.comparisons.includes(op.operation)) {
                sb.appendLine("cmp rax, rcx");
                sb.appendLine("xor rax, rax");
                switch (op.operation) {
                    case OperationType.MoreThan:
                        sb.appendLine("setg al");
                        break;
                    case OperationType.LessThan:
                        sb.appendLine("setl al");
                        break;
                    case OperationType.Equal:
                        sb.appendLine("setz al");
                        break;
                    case OperationType.NotEqual:
                        sb.appendLine("setnz al");
                        break;
                    case OperationType.MoreThanEqual:
                        sb.appendLine("setge al");
                        break;
                    case OperationType.LessThanEqual:
                        sb.appendLine("setle al");
                        break;
                }
            }
        }

        if (this.complexOps.includes(op.operation)) {
            let clauseLabel = this.label;
            let endLabel = this.label;

            if (op.operation === OperationType.LogicalOR) {
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("cmp rax, 0");
                sb.appendLine("je " + clauseLabel);
                sb.appendLine("mov rax, 1d");
                sb.appendLine("jmp " + endLabel);
                sb = this.generateLabel(sb, clauseLabel);
                sb = this.generateExpression(sb, op.childNodes[1]);
                sb.appendLine("cmp rax, 0");
                sb.appendLine("xor rax, rax");
                sb.appendLine("setne al");
                sb = this.generateLabel(sb, endLabel);
            } else if (op.operation === OperationType.LogicalAND) {
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("cmp rax, 0");
                sb.appendLine("jne " + clauseLabel);
                sb.appendLine("jmp " + endLabel);
                sb = this.generateLabel(sb, clauseLabel);
                sb = this.generateExpression(sb, op.childNodes[1]);
                sb.appendLine("cmp rax, 0");
                sb.appendLine("xor rax, rax");
                sb.appendLine("setne al");
                sb = this.generateLabel(sb, endLabel);
            }
        }

        return sb;
    }

    private static generateAssignment(sb: StringBuilder, expr: AssignmentASTNode): StringBuilder {
        let offset = this.stackMap.Get(expr.declaration.variableName);
        sb = this.generateExpression(sb, expr.expression);
        sb.appendLine("mov [rbp-" + offset + "], rax");
        return sb;
    }

    private static generateReference(sb: StringBuilder, expr: VariableASTNode): StringBuilder {
        let offset = this.stackMap.Get(expr.declaration.variableName);
        sb.appendLine("mov rax, [rbp-" + offset + "]");
        return sb;
    }
}
