import { AbstractSyntaxTree } from "./AST/AbstractSyntaxTree";
import { AssignmentASTNode } from "./AST/AssignmentASTNode";
import { ConstantASTNode } from "./AST/ConstantASTNode";
import { DeclarationASTNode } from "./AST/DeclarationASTNode";
import { DiadicASTNode } from "./AST/DiadicASTNode";
import { ExpressionASTNode, ValueType } from "./AST/ExpressionASTNode";
import { FunctionASTNode } from "./AST/FunctionASTNode";
import { FunctionCallASTNode } from "./AST/FunctionCallASTNode";
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
import { CompilerMacroASTNode, MacroType } from "./AST/CompilerMacroASTNode";
import { AssemblyMacroASTNode } from "./AST/AssemblyMacroASTNode";

export interface IFootprint {
    name: string;
    type: ValueType;
    args: IArg[];
    tokenStart: number;
    tokenEnd: number;
}

interface IArg {
    name: string;
    type: ValueType;
}
export class Parser {
    private static readonly INT_MAX_VALUE: number = 2 ** 31;

    private static monadicOperators: TokenType[] = [
        TokenType.Negation, TokenType.BitwiseNOT, TokenType.LogicalNOT,
    ];
    private static diadicOperators: TokenType[] = [
        TokenType.Addition, TokenType.Negation, TokenType.Multiplication, TokenType.Division
    ];
    private static variables: HashMap<string, Declaration> = new HashMap<string, Declaration>();
    private static functions: HashMap<string, IFootprint> = new HashMap<string, IFootprint>();

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
                this.parseAllFunctions(tokens)
            )
        );
    }

    private static parseAllFunctions(tokens: Token[]): FunctionASTNode[] {
        // Copy array
        let footprintToks: Token[] = tokens.concat();

        let next: IFootprint = this.parseFunctionFootprint(footprintToks, tokens.length - footprintToks.length);
        for (; next !== null; next = this.parseFunctionFootprint(footprintToks, tokens.length - footprintToks.length)) {
            this.functions.Add(next.name, next);
        }

        let funcs: FunctionASTNode[] = [];
        for (let func of this.functions.GetValues()) {
            console.log(tokens.slice(func.tokenStart, func.tokenEnd).toString());
            funcs.push(this.parseFunction(tokens.slice(func.tokenStart, func.tokenEnd)));
        }

        return funcs;
    }

    private static parseFunctionFootprint(tokens: Token[], start: number): IFootprint {
        if (tokens.length === 0) return null;

        let end = start + 1;
        let type = this.parseToken(tokens,
            x => (x.tokenType === TokenType.Keyword && ExpressionASTNode.getTypeFromString(x.tokenValue) !== null),
            "type"
        );

        end++;
        let name = this.parseToken(tokens, TokenType.Identifier);

        end++;
        this.parseToken(tokens, TokenType.OpenParen);

        let funcArgs: IArg[] = [];
        while (tokens[0].tokenType !== TokenType.CloseParen) {
            if (funcArgs.length > 0) {
                this.parseToken(tokens, TokenType.Comma);
                end++;
            }
            let argType = this.parseToken(tokens,
                x => (x.tokenType === TokenType.Keyword && ExpressionASTNode.getTypeFromString(x.tokenValue) !== null),
                "type"
            );

            let argName = this.parseToken(tokens, TokenType.Identifier);

            funcArgs.push({
                name: argName.tokenValue,
                type: ExpressionASTNode.getTypeFromString(argType.tokenValue)
            });

            end += 2;
        }

        end++;
        this.parseToken(tokens, TokenType.CloseParen);

        end++;
        this.parseToken(tokens, TokenType.OpenBrace);

        let level: number = 1;
        while (level) {
            if (tokens[0].tokenType === TokenType.OpenBrace) {
                level++;
            } else if (tokens[0].tokenType === TokenType.CloseBrace) {
                level--;
            }
            tokens.shift();
            end++;
        }

        return {
            args: funcArgs,
            name: name.tokenValue,
            tokenEnd: end,
            tokenStart: start,
            type: ExpressionASTNode.getTypeFromString(type.tokenValue)
        };
    }

    private static parseFunction(tokens: Token[]): FunctionASTNode {
        let returnTypeTok: Token = this.parseToken(tokens,
            x => (x.tokenType === TokenType.Keyword && ExpressionASTNode.getTypeFromString(x.tokenValue) !== null),
            "type"
        );

        let subNameTok: Token = this.parseToken(tokens, TokenType.Identifier);

        this.parseToken(tokens, TokenType.OpenParen);

        let funcArgs: Declaration[] = [];
        while (tokens[0].tokenType !== TokenType.CloseParen) {
            if (funcArgs.length > 0) {
                this.parseToken(tokens, TokenType.Comma);
            }
            let argType = this.parseToken(tokens,
                x => (x.tokenType === TokenType.Keyword && ExpressionASTNode.getTypeFromString(x.tokenValue) !== null),
                "type"
            );

            let argName = this.parseToken(tokens, TokenType.Identifier);

            let dec: Declaration = new Declaration(argName.tokenValue, argType.tokenValue);
            funcArgs.push(dec);
            this.variables.Add(argName.tokenValue, dec);
        }

        let closeParenTok: Token = this.parseToken(tokens, TokenType.CloseParen);

        let statements: StatementASTNode[] = this.parseBlock(tokens, true);

        return new FunctionASTNode(
            subNameTok.tokenValue,
            returnTypeTok.tokenValue,
            statements,
            funcArgs
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
            x => (x.tokenType === TokenType.Keyword
                || x.tokenType === TokenType.Identifier
                || x.tokenType === TokenType.Macro),
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
        } else if (tok.tokenType === TokenType.Identifier) {
            if (tokens[0].tokenType === TokenType.Assignment) {
                statement = this.parseAssignment(tokens, tok);
            } else if (tokens[0].tokenType === TokenType.OpenParen) {
                statement = this.parseFuncCall(tokens, tok);
            }
        } else if (tok.tokenType === TokenType.Macro) {
            statement = this.parseMacro(tokens);
            needSemicolon = false;
        }

        if (needSemicolon) {
            this.parseToken(tokens, TokenType.Semicolon);
        }

        return statement;
    }

    private static parseMacro(tokens: Token[]): CompilerMacroASTNode {
        let macroToken: Token = this.parseToken(tokens, TokenType.Identifier);
        let macroType: MacroType = CompilerMacroASTNode.macroFromString(macroToken.tokenValue);
        let macroContents: string = this.parseToken(tokens, TokenType.String).tokenValue;

        return new AssemblyMacroASTNode(macroContents);
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

    private static parseFuncCall(tokens: Token[], tok: Token): FunctionCallASTNode {
        let func: IFootprint = this.functions.Get(tok.tokenValue);
        if (!func) {
            throw new Error("Could not find function " + tok.tokenValue);
        }

        this.parseToken(tokens, TokenType.OpenParen);

        let argExprs: ExpressionASTNode[] = [];
        for (let i = 0; i < func.args.length; i++) {
            let arg: ExpressionASTNode = this.parseExpression(tokens);
            if (arg.expressionType !== null && arg.expressionType !== func.args[i].type) {
                throw new Error("Type " + arg.expressionType + " is not assignable to type " + func.args[i].type);
            }
            argExprs.push(arg);
            if (i + 1 < func.args.length) this.parseToken(tokens, TokenType.Comma);
        }

        this.parseToken(tokens, TokenType.CloseParen);

        return new FunctionCallASTNode(func, argExprs);
    }

    private static parseIf(tokens: Token[]): IfASTNode {
        let tok: Token = this.parseToken(tokens, TokenType.OpenParen);

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
        } else if (next.tokenType === TokenType.String) {
            return new ConstantASTNode(next.tokenValue, ValueType.string);
        } else if (next.tokenType === TokenType.Identifier) {
            if (tokens[0].tokenType === TokenType.OpenParen) {
                return this.parseFuncCall(tokens, next);
            } else if (this.variables.Has(next.tokenValue)) {
                return new VariableASTNode(this.variables.Get(next.tokenValue));
            }
        }

        throw new Error("Invalid factor: " + (next ? next.toString() : "<EOF>"));
    }

    private static parseToken(
        tokens: Token[], expected: ((tok: Token) => boolean) | string | TokenType, errStr?: string
    ): Token {
        if (tokens.length === 0) throw new Error("Expected " + expected + " but found <EOF>");
        let tok: Token = tokens.shift();
        let err: boolean = false;
        if (typeof(expected) === "string") err = tok.tokenValue !== expected;
        else if (typeof(expected) === "function") err = !expected(tok);
        else err = tok.tokenType !== expected;
        if (err) {
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
