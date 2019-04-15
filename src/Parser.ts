import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { ExpressionASTNode } from "./AST/ExpressionASTNode";
import { OperationASTNode, OperationType } from "./AST/OperationASTNode";
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

    private static parseExpression(tokens: Token[]): ExpressionASTNode {
        let tok: Token = tokens.shift();
        if (tok.tokenType === TokenType.Integer) {
            if (tok.tokenValue >= this.INT_MAX_VALUE) {
                throw new Error("" + tok.tokenValue + " is larger than " + this.INT_MAX_VALUE);
            }

            return new ConstantASTNode(tok.tokenValue);
        } else if (this.monadicOperators.includes(tok.tokenType)) {
            return this.parseMonadicOperator(tokens, tok);
        }

        throw new Error("Unknown expression token");
    }

    private static parseMonadicOperator(tokens: Token[], opTok: Token): OperationASTNode {
        let opType: OperationType;

        switch (opTok.tokenType) {
            case TokenType.Negation:
                opType = OperationType.Negation;
                break;
            case TokenType.BitwiseNOT:
                opType = OperationType.BitwiseNOT;
                break;
            case TokenType.LogicalNOT:
                opType = OperationType.LogicalNOT;
                break;
            default:
                throw new Error("Unknown operation type: " + opTok.tokenType);
        }

        return new OperationASTNode(
            opType,
            this.parseExpression(tokens)
        );
    }
}
