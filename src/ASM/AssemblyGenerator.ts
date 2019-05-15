import { AbstractSyntaxTree } from "../AST/AbstractSyntaxTree";
import { ArrayASTNode } from "../AST/ArrayASTNode";
import { AssemblyMacroASTNode } from "../AST/AssemblyMacroASTNode";
import { AssignmentASTNode } from "../AST/AssignmentASTNode";
import { ConstantASTNode } from "../AST/ConstantASTNode";
import { DeclarationASTNode } from "../AST/DeclarationASTNode";
import { ExpressionASTNode } from "../AST/ExpressionASTNode";
import { FunctionASTNode } from "../AST/FunctionASTNode";
import { FunctionCallASTNode } from "../AST/FunctionCallASTNode";
import { IfASTNode } from "../AST/IfASTNode";
import { KeywordASTNode, KeywordType } from "../AST/KeywordASTNode";
import { LoopASTNode } from "../AST/LoopASTNode";
import { OperationASTNode, OperationType } from "../AST/OperationASTNode";
import { ReturnStatementASTNode } from "../AST/ReturnStatementASTNode";
import { StatementASTNode } from "../AST/StatementASTNode";
import { VariableASTNode } from "../AST/VariableASTNode";
import { Declaration } from "../Declaration";
import { HashMap } from "../HashMap";
import { StringBuilder } from "../StringBuilder";
import { PlatformController } from "./PlatformController";

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

    private static funcMapping: HashMap<string, string> = new HashMap<string, string>();

    private static labelCount: number = 1;
    private static lastLoop: string[];

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
        sb.appendLine("call __func_main");
        sb = this.platformController.makeExit(sb, this.ax);
        sb.appendLine("");

        for (let func of ast.root.childNodes) {
            sb = this.generateFunction(sb, func);
        }

        return sb.toString();
    }

    private static generateFunction(sb: StringBuilder, func: FunctionASTNode): StringBuilder {
        this.funcMapping.Add(func.name, "__func_" + func.name);
        sb = this.generateLabel(sb, "__func_" + func.name);
        sb = this.platformController.makeStackFrame(sb);

        this.stackMap = new HashMap<string, number>();
        this.stackOffset = 0;

        for (let i = func.arguments.length - 1; i >= 0; i--) {
            this.stackMap.Add(func.arguments[i].variableName, -(this.platformController.wordSize * (i + 2)));
        }

        for (let statement of func.childNodes) {
            sb = this.generateStatement(sb, statement);
        }

        return sb;
    }

    private static generateLabel(sb: StringBuilder, label: string, comment?: string): StringBuilder {
        sb.indent--;
        sb.appendLine(label + ":" + (comment ? ` ; ${comment}` : ""));
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
        } else if (statement instanceof LoopASTNode) {
            return this.generateLoop(sb, statement);
        } else if (statement instanceof KeywordASTNode) {
            return this.generateKeyword(sb, statement);
        } else if (statement instanceof FunctionCallASTNode) {
            return this.generateFunctionCall(sb, statement);
        } else if (statement instanceof AssemblyMacroASTNode) {
            return this.generateAssemblyMacro(sb, statement);
        }

        throw new Error("Unknown AST node");
    }

    private static generateReturn(sb: StringBuilder, statement: ReturnStatementASTNode): StringBuilder {
        if (statement.childNodes !== null) sb = this.generateExpression(sb, statement.childNodes);

        sb = this.platformController.endStackFrame(sb);
        sb.appendLine("ret\n");

        return sb;
    }

    private static generateDeclaration(sb: StringBuilder, statement: DeclarationASTNode | Declaration): StringBuilder {
        let dec: Declaration = statement instanceof DeclarationASTNode
            ? statement.declaration
            : statement;
        let stat = statement instanceof DeclarationASTNode
            ? statement
            : null;

        if (this.stackMap.Has(dec.variableName)) {
            throw new Error("Variable '" + dec.variableName + "' has already been declared!");
        }

        if (stat && stat.expression) {
            sb = this.generateExpression(sb, stat.expression);
        } else if (!dec.isArray) {
            sb.appendLine(`mov ${this.ax}, 0d`);
        }

        if (!dec.isArray) {
            sb.appendLine(`push ${this.ax} ; assignment of ${dec.variableName}`);
            this.stackOffset += this.platformController.wordSize;
        }
        this.stackMap.Add(dec.variableName, this.stackOffset);

        return sb;
    }

    private static generateFunctionCall(sb: StringBuilder, call: FunctionCallASTNode): StringBuilder {
        for (let i = call.arguments.length - 1; i >= 0; i--) {
            sb = this.generateExpression(sb, call.arguments[i]);
            sb.appendLine("push " + this.ax);
        }
        sb.appendLine("call __func_" + call.functionName);

        return sb;
    }

    private static generateAssemblyMacro(sb: StringBuilder, macro: AssemblyMacroASTNode): StringBuilder {
        let process: (x: string) => string = (line => {
            return line.replace(/%([a-z]{2})/g, (_, p1) => this.platformController.getRegisterName(p1))
                .replace(/\$([a-zA-Z_]+)/g, (_, p1) => {
                    let offset = this.stackMap.Get(p1);
                    return `[${this.bp}${offset >= 0 ? "-" : "+"}${Math.abs(offset)}]`;
                })
                .replace(/\*([a-zA-Z_]+)/g, (_, p1) => {
                    let offset = this.stackMap.Get(p1);
                    return `${-offset}d`;
                });
        });

        for (let line of macro.assembly.split("\n")) {
            sb.appendLine(process(line));
        }

        return sb;
    }

    private static generateIf(sb: StringBuilder, ifNode: IfASTNode): StringBuilder {
        sb = this.generateExpression(sb, ifNode.condition);

        sb.appendLine(`cmp ${this.ax}, 0d`);
        let elseLabel: string = this.label;
        let endLabel: string = ""; // Only define this if 'else' exists
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

    private static generateLoop(sb: StringBuilder, loopNode: LoopASTNode): StringBuilder {
        let startLabel: string = this.label;
        let endLabel: string = this.label;
        for (let statement of loopNode.beforeNodes) {
            sb = this.generateStatement(sb, statement);
        }
        sb = this.generateLabel(sb, startLabel, `start of while loop (ends at ${endLabel})`);
        sb = this.generateExpression(sb, loopNode.condition);
        sb.appendLine(`cmp ${this.ax}, 0d`);
        sb.appendLine("je " + endLabel + " ; end of while loop condition");

        let oldLoop: string[] = this.lastLoop;
        this.lastLoop = [startLabel, endLabel];
        for (let statement of loopNode.childNodes) {
            sb = this.generateStatement(sb, statement);
        }
        this.lastLoop = oldLoop;
        sb.appendLine("jmp " + startLabel);
        sb = this.generateLabel(sb, endLabel, `end of while loop (starts at ${startLabel})`);

        return sb;
    }

    private static generateKeyword(sb: StringBuilder, keyword: KeywordASTNode): StringBuilder {
        switch (keyword.keywordType) {
            case KeywordType.break:
                if (!this.lastLoop) throw new Error("Attempted to break outside of loop");
                sb.appendLine("jmp " + this.lastLoop[1]);
                return sb;
            case KeywordType.continue:
                if (!this.lastLoop) throw new Error("Attempted to continue outside of loop");
                sb.appendLine("jmp " + this.lastLoop[0]);
                return sb;
            default:
                throw new Error("Unknown keyword: " + keyword.keywordType);
        }
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
        } else if (expr instanceof FunctionCallASTNode) {
            return this.generateFunctionCall(sb, expr);
        } else if (expr instanceof ArrayASTNode) {
            return this.generateArray(sb, expr);
        }

        throw new Error("Unknown AST node: " + JSON.stringify(expr));
    }

    private static generateArray(sb: StringBuilder, expr: ArrayASTNode): StringBuilder {
        for (let i = expr.arraySize - 1; i >= 0; i--) {
            let value: string = "0";
            if (expr.array.value) value = expr.array.value[i];
            if (Number.isNaN(parseInt(value))) value = value.charCodeAt(0).toString();
            sb.appendLine(`mov ${this.ax}, ${value}d`);
            sb.appendLine(`push ${this.ax} ; assignment of array[${i}]`);
        }

        this.stackOffset += this.platformController.wordSize * expr.arraySize;

        return sb;
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
        if (expr.declaration.isArray) {
            sb = this.generateExpression(sb, (expr.childNodes[0] as VariableASTNode).arrayIndex);
            sb.appendLine(`mov ${this.bx}, ${this.platformController.wordSize}d`);
            sb.appendLine(`mul ${this.bx} ; multiply index by wordSize`);
            sb.appendLine(`mov ${this.cx}, ${this.bp} ; start at base of stack`);
            sb.appendLine(`sub ${this.cx}, ${offset} ; move to start of array`);
            sb.appendLine(`add ${this.cx}, ${this.ax} ; move to correct index`);
        }
        sb = this.generateExpression(sb, expr.expression);
        if (expr.declaration.isArray) {
            sb.appendLine("mov [" + this.cx + "], " + this.ax + " ; assignment of " + expr.declaration.variableName);
        } else {
            sb.appendLine(`mov [${this.bp}-${offset}], ${this.ax} ; assignment of ` + expr.declaration.variableName);
        }
        return sb;
    }

    private static generateReference(sb: StringBuilder, expr: VariableASTNode): StringBuilder {
        let offset = this.stackMap.Get(expr.declaration.variableName);
        if (expr.isArray) {
            sb = this.generateExpression(sb, expr.arrayIndex);
            sb.appendLine(`mov ${this.bx}, ${this.platformController.wordSize}d`);
            sb.appendLine(`mul ${this.bx} ; multiply index by wordSize`);
            sb.appendLine(`mov ${this.cx}, ${this.ax}`);
            sb.appendLine(`mov ${this.ax}, ${this.bp} ; start at base of stack`);
            sb.appendLine(`sub ${this.ax}, ${offset} ; move to start of array`);
            sb.appendLine(`add ${this.ax}, ${this.cx} ; move to correct index`);
            sb.appendLine(`mov ${this.ax}, [${this.ax}]`
                + ` ; reference to ${expr.declaration.variableName}[]`);
        } else {
            let stackPos = `[${this.bp}${offset >= 0 ? "-" : "+"}${Math.abs(offset)}]`;
            sb.appendLine(`mov ${this.ax}, ${stackPos} ; reference to ${expr.declaration.variableName}`);
        }
        return sb;
    }
}
