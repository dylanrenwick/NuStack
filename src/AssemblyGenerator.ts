import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { ExpressionASTNode } from "./AST/ExpressionASTNode";
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
		}

		throw new Error("Unknown AST node");
	}

	private static generateConstant(expr: ConstantASTNode): string {
		return "movl " + expr.expressionValue + "d, eax\n";
	}
}
