import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { DiadicASTNode } from "./AST/DiadicASTNode";
import { ExpressionASTNode } from "./AST/ExpressionASTNode";
import { MonadicASTNode } from "./AST/MonadicASTNode";
import { OperationType } from "./AST/OperationASTNode";
import { ProgramASTNode } from "./AST/ProgramASTNode";
import { ReturnStatementASTNode } from "./AST/ReturnStatementASTNode";
import { StatementASTNode } from "./AST/StatementASTNode";
import { SubroutineASTNode } from "./AST/SubroutineASTNode";
import { Token, TokenType } from "./Token";

export class Parser {
    private static readonly INT_MAX_VALUE: number = 2 ** 31;

    private static monadicOperators: TokenType[] = [
        TokenType.Negation, TokenType.BitwiseNOT, TokenType.LogicalNOT,
    ];
    private static diadicOperators: TokenType[] = [
        TokenType.Addition, TokenType.Subtraction, TokenType.Multiplication, TokenType.Division
    ];

    private static exprOperators: TokenType[][] = [
        [TokenType.LogicalOR], [TokenType.LogicalAND],
        [TokenType.Equal, TokenType.NotEqual],
        [TokenType.LessThan, TokenType.LessThanEqual,
         TokenType.MoreThan, TokenType.MoreThanEqual],
        [TokenType.Addition, TokenType.Subtraction],
        [TokenType.Multiplication, TokenType.Division]
    ];

    public static parse(tokens: Token[]): AbstractSyntaxTree {
        return new AbstractSyntaxTree(
            new ProgramASTNode(
                this.parseSubroutine(tokens)
            )
        );
    }

    private static parseSubroutine(tokens: Token[]): SubroutineASTNode {
        let returnTypeTok: Token = tokens.shift();
        if (returnTypeTok.tokenType !== TokenType.Keyword ||
            returnTypeTok.tokenValue !== "int") {
            throw new Error("Expected 'int' but found " + returnTypeTok.toString());
        }

        let subNameTok: Token = tokens.shift();
        if (subNameTok.tokenType !== TokenType.Identifier) {
            throw new Error("Expected identifier but found " + subNameTok.toString());
        }

        let openParenTok: Token = tokens.shift();
        if (openParenTok.tokenType !== TokenType.OpenParen) {
            throw new Error("Expected '(' but found " + openParenTok.toString());
        }
        let closeParenTok: Token = tokens.shift();
        if (closeParenTok.tokenType !== TokenType.CloseParen) {
            throw new Error("Expected ')' but found " + closeParenTok.toString());
        }

        let openBraceTok: Token = tokens.shift();
        if (openBraceTok.tokenType !== TokenType.OpenBrace) {
            throw new Error("Expected '{' but found " + openBraceTok.toString());
        }

        let statements: StatementASTNode[] = [];

        while (tokens.length > 0 && tokens[0].tokenType !== TokenType.CloseBrace) {
            statements.push(this.parseStatement(tokens));
        }

        if (tokens.length === 0) {
            throw new Error("Expected '}' but found <EOF>");
        }

        let closeBraceTok: Token = tokens.shift();
        if (closeBraceTok.tokenType !== TokenType.CloseBrace) {
            throw new Error("Expected '}' but found " + closeBraceTok.toString());
        }

        return new SubroutineASTNode(
            subNameTok.tokenValue,
            returnTypeTok.tokenValue,
            statements
        );
    }

    private static parseStatement(tokens: Token[]): StatementASTNode {
        let tok: Token = tokens.shift();
        if (tok.tokenType !== TokenType.Keyword ||
            tok.tokenValue !== "return") {
            throw new Error("Expected 'return' but found " + tok.toString());
        }

        let statement: StatementASTNode = new ReturnStatementASTNode(
            this.parseExpression(tokens)
        );

        tok = tokens.shift();
        if (tok.tokenType !== TokenType.Semicolon) {
            throw new Error("Expected ';' but found " + tok.toString());
        }

        return statement;
    }

    private static parseExpression(tokens: Token[], operatorsIndex: number = 0): ExpressionASTNode {
        let term: ExpressionASTNode = operatorsIndex === this.exprOperators.length - 1
            ? this.parseFactor(tokens)
            : this.parseExpression(tokens, operatorsIndex + 1);
        let next: Token = tokens[0];
        while (this.exprOperators[operatorsIndex].includes(next.tokenType)) {
            let op: OperationType = this.parseOpType(tokens.shift());
            let nextTerm: ExpressionASTNode = operatorsIndex === this.exprOperators.length - 1
                ? this.parseFactor(tokens)
                : this.parseExpression(tokens, operatorsIndex + 1);
            term = new DiadicASTNode(
                op, term, nextTerm
            );

            next = tokens[0];
        }

        return term;
    }

    private static parseFactor(tokens: Token[]): ExpressionASTNode {
        let next: Token = tokens.shift();

        if (next.tokenType === TokenType.OpenParen) {
            let expr: ExpressionASTNode = this.parseExpression(tokens);
            if (tokens.shift().tokenType !== TokenType.CloseParen) {
                throw new Error("Expected close paren but got " + next.tokenType);
            }
            return expr;
        } else if (this.monadicOperators.includes(next.tokenType)) {
            let op: OperationType = this.parseOpType(next);
            let factor: ExpressionASTNode = this.parseFactor(tokens);
            return new MonadicASTNode(op, factor);
        } else if (next.tokenType === TokenType.Integer) {
            return new ConstantASTNode(next.tokenValue);
        } else {
            throw new Error("Invalid factor: " + next.tokenType);
        }
    }

    private static parseOpType(tok: Token): OperationType {
        switch (tok.tokenType) {
            case TokenType.Negation: return OperationType.Negation;
            case TokenType.BitwiseNOT: return OperationType.BitwiseNOT;
            case TokenType.LogicalNOT: return OperationType.LogicalNOT;
            case TokenType.Addition: return OperationType.Addition;
            case TokenType.Subtraction: return OperationType.Subtraction;
            case TokenType.Multiplication: return OperationType.Multiplication;
            case TokenType.Division: return OperationType.Division;
            case TokenType.MoreThan: return OperationType.MoreThan;
            case TokenType.LessThan: return OperationType.LessThan;
            case TokenType.Equal: return OperationType.Equal;
            case TokenType.NotEqual: return OperationType.NotEqual;
            case TokenType.MoreThanEqual: return OperationType.MoreThanEqual;
            case TokenType.LessThanEqual: return OperationType.LessThanEqual;
            case TokenType.LogicalOR: return OperationType.LogicalOR;
            case TokenType.LogicalAND: return OperationType.LogicalAND;
            default: throw new Error("Invalid operator: " + tok.tokenType);
        }
    }
}
