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
import { PlatformController } from "./PlatformController";
import { IfASTNode } from "../AST/IfASTNode";

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

    private static platformController: PlatformController;

    private static get ax(): string { return this.platformController.ax; }
    private static get bx(): string { return this.platformController.bx; }
    private static get cx(): string { return this.platformController.cx; }
    private static get dx(): string { return this.platformController.dx; }

    private static get bp(): string { return this.platformController.bp; }
    private static get sp(): string { return this.platformController.sp; }

    private static get si(): string { return this.platformController.si; }
    private static get di(): string { return this.platformController.di; }

    private static get label(): string { return "_util_label" + this.labelCount++; }

    public static generate(ast: AbstractSyntaxTree, platform: PlatformController): string {
        this.platformController = platform;
        let sb: StringBuilder = new StringBuilder();

        sb.appendLine("section .text");
        sb.appendLine("global _start");
        sb.appendLine("");
        sb.appendLine("_start:");
        sb.indent++;
        sb.appendLine("call main");
        sb = this.platformController.makeExit(sb, this.ax);
        sb.appendLine("");

        sb = this.generateSubroutine(sb, ast.root.childNodes);

        return sb.toString();
    }

    private static generateSubroutine(sb: StringBuilder, sub: SubroutineASTNode): StringBuilder {
        sb = this.generateLabel(sb, sub.name);
        sb = this.platformController.makeStackFrame(sb);

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
        } else if (statement instanceof IfASTNode) {
            return this.generateIf(sb, statement);
        }

        throw new Error("Unknown AST node");
    }

    private static generateReturn(sb: StringBuilder, statement: ReturnStatementASTNode): StringBuilder {
        if (statement.childNodes !== null) sb = this.generateExpression(sb, statement.childNodes);

        sb = this.platformController.endStackFrame(sb);
        sb.appendLine("ret");

        return sb;
    }

    private static generateDeclaration(sb: StringBuilder, statement: DeclarationASTNode): StringBuilder {
        let dec: Declaration = statement.declaration;

        if (this.stackMap.Has(dec.variableName)) {
            throw new Error("Variable '" + dec.variableName + "' has already been declared!");
        }

        if (statement.expression) {
            sb = this.generateExpression(sb, statement.expression);
        } else {
            sb.appendLine(`mov ${this.ax}, 0d`);
        }

        sb.appendLine("push " + this.ax);

        this.stackOffset += this.platformController.wordSize;
        this.stackMap.Add(dec.variableName, this.stackOffset);

        return sb;
    }

    private static generateIf(sb: StringBuilder, ifNode: IfASTNode): StringBuilder {
        sb = this.generateExpression(sb, ifNode.condition);

        sb.appendLine(`cmp ${this.ax}, 0d`);
        let elseLabel: string = this.label;
        let endLabel: string = ""; // Only define this if else exists
        sb.appendLine("je " + elseLabel);

        for (let statement of ifNode.ifBlock) {
            sb = this.generateStatement(sb, statement);
        }

        if (ifNode.elseBlock !== null) {
            endLabel = this.label;
            sb.appendLine("jmp " + endLabel);
        }

        sb = this.generateLabel(sb, elseLabel);

        if (ifNode.elseBlock !== null) {
            for (let statement of ifNode.elseBlock) {
                sb = this.generateStatement(sb, statement);
            }
            sb = this.generateLabel(sb, endLabel);
        }

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
        sb.appendLine(`mov ${this.ax}, ` + expr.expressionValue + "d");
        return sb;
    }

    private static generateOperation(sb: StringBuilder, op: OperationASTNode): StringBuilder {
        switch (op.operation) {
            case OperationType.Negation:
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("neg " + this.ax);
                break;
            case OperationType.BitwiseNOT:
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine("not " + this.ax);
                break;
            case OperationType.LogicalNOT:
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine(`cmp ${this.ax}, 0`);
                sb.appendLine(`mov ${this.ax}, 0`);
                sb.appendLine("setz al");
                break;
        }

        if (this.diadicOps.includes(op.operation)) {
            let swap: boolean = op.operation === OperationType.Division || op.operation === OperationType.Subtraction;
            sb = this.generateExpression(sb, op.childNodes[swap ? 1 : 0]);
            sb.appendLine("push " + this.ax);
            sb = this.generateExpression(sb, op.childNodes[swap ? 0 : 1]);
            sb.appendLine("pop " + this.cx);
            switch (op.operation) {
                case OperationType.Addition:
                    sb.appendLine(`add ${this.ax}, ${this.cx}`);
                    break;
                case OperationType.Subtraction:
                    sb.appendLine(`sub ${this.ax}, ${this.cx}`);
                    break;
                case OperationType.Multiplication:
                    sb.appendLine("mul " + this.cx);
                    break;
                case OperationType.Division:
                    sb.appendLine(`mov ${this.dx}, 0`);
                    sb.appendLine("div " + this.cx);
                    break;
            }

            if (this.comparisons.includes(op.operation)) {
                sb.appendLine(`cmp ${this.cx}, ${this.ax}`);
                sb.appendLine(`mov ${this.ax}, 0`);
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
                sb.appendLine(`cmp ${this.ax}, 0`);
                sb.appendLine("je " + clauseLabel);
                sb.appendLine(`mov ${this.ax}, 1d`);
                sb.appendLine("jmp " + endLabel);
                sb = this.generateLabel(sb, clauseLabel);
                sb = this.generateExpression(sb, op.childNodes[1]);
                sb.appendLine(`cmp ${this.ax}, 0`);
                sb.appendLine(`mov ${this.ax}, 0`);
                sb.appendLine("setne al");
                sb = this.generateLabel(sb, endLabel);
            } else if (op.operation === OperationType.LogicalAND) {
                sb = this.generateExpression(sb, op.childNodes[0]);
                sb.appendLine(`cmp ${this.ax}, 0`);
                sb.appendLine("jne " + clauseLabel);
                sb.appendLine("jmp " + endLabel);
                sb = this.generateLabel(sb, clauseLabel);
                sb = this.generateExpression(sb, op.childNodes[1]);
                sb.appendLine(`cmp ${this.ax}, 0`);
                sb.appendLine(`mov ${this.ax}, 0`);
                sb.appendLine("setne al");
                sb = this.generateLabel(sb, endLabel);
            }
        }

        return sb;
    }

    private static generateAssignment(sb: StringBuilder, expr: AssignmentASTNode): StringBuilder {
        let offset = this.stackMap.Get(expr.declaration.variableName);
        sb = this.generateExpression(sb, expr.expression);
        sb.appendLine("mov [rbp-" + offset + "], " + this.ax);
        return sb;
    }

    private static generateReference(sb: StringBuilder, expr: VariableASTNode): StringBuilder {
        let offset = this.stackMap.Get(expr.declaration.variableName);
        sb.appendLine(`mov ${this.ax}, [${this.bp}-` + offset + "]");
        return sb;
    }
}
