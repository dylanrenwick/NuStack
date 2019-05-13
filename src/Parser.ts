import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { AssignmentASTNode } from "./AST/AssignmentASTNode";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { DeclarationASTNode } from "./AST/DeclarationASTNode";
import { DiadicASTNode } from "./AST/DiadicASTNode";
import { ExpressionASTNode, ValueType } from "./AST/ExpressionASTNode";
import { FunctionASTNode } from "./AST/FunctionASTNode";
import { IfASTNode } from "./AST/IfASTNode";
import { KeywordASTNode, KeywordType } from "./AST/KeywordASTNode";
import { MonadicASTNode } from "./AST/MonadicASTNode";
import { OperationType } from "./AST/OperationASTNode";
import { ProgramASTNode } from "./AST/ProgramASTNode";
import { ReturnStatementASTNode } from "./AST/ReturnStatementASTNode";
import { StatementASTNode } from "./AST/StatementASTNode";
import { VariableASTNode } from "./AST/VariableASTNode";
import { WhileASTNode } from "./AST/WhileASTNode";
import { Declaration } from "./Declaration";
import { HashMap } from "./HashMap";
import { Token, TokenType } from "./Token";

export class Parser {
    private static readonly INT_MAX_VALUE: number = 2 ** 31;

    private static monadicOperators: TokenType[] = [
        TokenType.Negation, TokenType.BitwiseNOT, TokenType.LogicalNOT,
    ];
    private static diadicOperators: TokenType[] = [
        TokenType.Addition, TokenType.Negation, TokenType.Multiplication, TokenType.Division
    ];
    private static variables: HashMap<string, Declaration> = new HashMap<string, Declaration>();

    private static exprOperators: TokenType[][] = [
        [TokenType.LogicalOR], [TokenType.LogicalAND],
        [TokenType.Equal, TokenType.NotEqual],
        [TokenType.LessThan, TokenType.LessThanEqual,
         TokenType.MoreThan, TokenType.MoreThanEqual],
        [TokenType.Addition, TokenType.Negation],
        [TokenType.Multiplication, TokenType.Division]
    ];

    public static parse(tokens: Token[]): AbstractSyntaxTree {
        return new AbstractSyntaxTree(
            new ProgramASTNode(
                this.parseFunction(tokens)
            )
        );
    }

    private static parseFunction(tokens: Token[]): FunctionASTNode {
        let returnTypeTok: Token = tokens.shift();
        if (returnTypeTok.tokenType !== TokenType.Keyword ||
            ExpressionASTNode.getTypeFromString(returnTypeTok.tokenValue) === null) {
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

        let statements: StatementASTNode[] = this.parseBlock(tokens, true);

        return new FunctionASTNode(
            subNameTok.tokenValue,
            returnTypeTok.tokenValue,
            statements
        );
    }

    private static parseBlock(
        tokens: Token[], needBrace: boolean = false, inLoop: boolean = false
    ): StatementASTNode[] {
        let statements: StatementASTNode[] = [];

        if (tokens[0].tokenType === TokenType.OpenBrace) {
            // Can't use shift here in TS ^3.3.0 as tsc doesn't recognize it as modifying the array
            // TODO: https://github.com/microsoft/TypeScript/issues/31334
            tokens.shift();
            while (tokens.length > 0 && tokens[0].tokenType !== TokenType.CloseBrace) {
                statements.push(this.parseStatement(tokens, inLoop));
            }

            let closeBraceTok: Token = this.parseToken(tokens, TokenType.CloseBrace);
        } else if (needBrace) {
            throw new Error("Expected '{' but found " + tokens[0].toString());
        } else {
            statements.push(this.parseStatement(tokens, inLoop));
        }

        return statements;
    }

    private static parseStatement(tokens: Token[], inLoop: boolean = false): StatementASTNode {
        let tok: Token = this.parseToken(tokens,
            x => (x.tokenType === TokenType.Keyword || x.tokenType === TokenType.Identifier),
            "statement"
        );

        let needSemicolon: boolean = true;

        let statement: StatementASTNode;

        if (tok.tokenType === TokenType.Keyword) {
            switch (tok.tokenValue) {
                case "return":
                    statement = new ReturnStatementASTNode(
                        this.parseExpression(tokens)
                    );
                    break;
                case "if":
                    statement = this.parseIf(tokens);
                    needSemicolon = false;
                    break;
                case "while":
                    statement = this.parseWhile(tokens);
                    needSemicolon = false;
                    break;
                case "break":
                    statement = new KeywordASTNode(KeywordType.break);
                    break;
                case "continue":
                    statement = new KeywordASTNode(KeywordType.continue);
                    break;
                default:
                    statement = this.parseDeclaration(tokens, tok);
            }
        } else {
            statement = this.parseAssignment(tokens, tok);
        }

        if (needSemicolon) {
            tok = this.parseToken(tokens, TokenType.Semicolon);
        }

        return statement;
    }

    private static parseDeclaration(tokens: Token[], tok: Token): DeclarationASTNode {
        let type: string = tok.tokenValue;
        tok = this.parseToken(tokens, TokenType.Identifier);
        let name = tok.tokenValue;
        let declaration = new Declaration(name, type);
        this.variables.Add(name, declaration);

        let expr: ExpressionASTNode = null;

        if (tokens[0].tokenType === TokenType.Assignment) {
            tokens.shift();
            expr = this.parseExpression(tokens);
            if (expr.expressionType !== declaration.variableType) {
                throw new Error("Type " + expr.expressionType
                    + " is not assignable to type " + declaration.variableType);
            }
        }

        return new DeclarationASTNode(declaration, expr);
    }

    private static parseAssignment(tokens: Token[], tok: Token): AssignmentASTNode {
        if (!this.variables.Has(tok.tokenValue)) {
            throw new Error("Attempt to reference local variable '" + tok.toString() + "' before it was defined");
        }
        let dec: Declaration = this.variables.Get(tok.tokenValue);

        tok = this.parseToken(tokens, TokenType.Assignment);

        let expr: ExpressionASTNode = this.parseExpression(tokens);

        if (expr.expressionType !== dec.variableType) {
            throw new Error("Type " + expr.expressionType
                + " is not assignable to type " + dec.variableType);
        }

        return new AssignmentASTNode(dec, expr);
    }

    private static parseIf(tokens: Token[]): IfASTNode {
        let tok: Token = tokens.shift();
        if (tok.tokenType !== TokenType.OpenParen) {
            throw new Error("Expected '(' after 'if', but found " + tok.toString());
        }

        let condition: ExpressionASTNode = this.parseExpression(tokens);
        if (condition.expressionType !== ValueType.bool) {
            throw new Error("Type " + condition.expressionType + " is not bool");
        }

        tok = this.parseToken(tokens, TokenType.CloseParen);

        let block: StatementASTNode[] = this.parseBlock(tokens);
        let elseBlock: StatementASTNode[] = null;

        if (tokens[0].tokenType === TokenType.Keyword &&
            tokens[0].tokenValue === "else") {
            tokens.shift();
            elseBlock = this.parseBlock(tokens);
        }

        return new IfASTNode(condition, block, elseBlock);
    }

    private static parseWhile(tokens: Token[]): WhileASTNode {
        let tok: Token = this.parseToken(tokens, TokenType.OpenParen);

        let condition: ExpressionASTNode = this.parseExpression(tokens);
        if (condition.expressionType !== ValueType.bool) {
            throw new Error("Type " + condition.expressionType + " is not bool");
        }

        tok = this.parseToken(tokens, TokenType.CloseParen);

        let block: StatementASTNode[] = this.parseBlock(tokens, false, true);

        return new WhileASTNode(condition, block);
    }

    private static parseExpression(tokens: Token[], operatorsIndex: number = 0): ExpressionASTNode {
        let term: ExpressionASTNode = operatorsIndex === this.exprOperators.length - 1
            ? this.parseFactor(tokens)
            : this.parseExpression(tokens, operatorsIndex + 1);
        let next: Token = tokens[0];
        while (next && this.exprOperators[operatorsIndex].includes(next.tokenType)) {
            let op: OperationType = this.parseOpType(tokens.shift(), true);
            let nextTerm: ExpressionASTNode = operatorsIndex === this.exprOperators.length - 1
                ? this.parseFactor(tokens)
                : this.parseExpression(tokens, operatorsIndex + 1);
            if (term.expressionType !== nextTerm.expressionType) {
                throw new Error("Operator " + op + " is not valid for types "
                    + term.expressionType + " and " + nextTerm.expressionType);
            }
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
            this.parseToken(tokens, TokenType.CloseParen);
            return expr;
        } else if (this.monadicOperators.includes(next.tokenType)) {
            let op: OperationType = this.parseOpType(next);
            let factor: ExpressionASTNode = this.parseFactor(tokens);
            return new MonadicASTNode(op, factor);
        } else if (next.tokenType === TokenType.Integer) {
            return new ConstantASTNode(next.tokenValue, ValueType.int);
        } else if (next.tokenType === TokenType.Identifier
            && this.variables.Has(next.tokenValue)) {
            return new VariableASTNode(this.variables.Get(next.tokenValue));
        } else {
            throw new Error("Invalid factor: " + (next ? next.toString() : "<EOF>"));
        }
    }

    private static parseToken(
        tokens: Token[], expected: ((tok: Token) => boolean) | string | TokenType, errStr?: string
    ): Token {
        if (tokens.length === 0) throw new Error("Expected " + expected + " but found <EOF>");
        let tok: Token = tokens.shift();
        if ((typeof(expected) === "string" && tok.tokenValue !== expected)
            || (typeof(expected) === "function" && !expected(tok))
            || tok.tokenType !== expected) {
            throw new Error("Expected "
                + (typeof(expected) === "function" ? errStr : expected)
                + " but found " + tok.toString());
        }
        return tok;
    }

    private static parseOpType(tok: Token, diadic: boolean = false): OperationType {
        switch (tok.tokenType) {
            case TokenType.Negation: return diadic ? OperationType.Subtraction : OperationType.Negation;
            case TokenType.BitwiseNOT: return OperationType.BitwiseNOT;
            case TokenType.LogicalNOT: return OperationType.LogicalNOT;
            case TokenType.Addition: return OperationType.Addition;
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
            case TokenType.Assignment: return OperationType.Assignment;
            default: throw new Error("Invalid operator: " + (tok ? tok.toString() : "<EOF>"));
        }
    }
}
