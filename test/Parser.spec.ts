import { expect } from "chai";
import { ConstantASTNode } from "../src/AST/ConstantASTNode";
import { DiadicASTNode } from "../src/AST/DiadicASTNode";
import { ExpressionASTNode } from "../src/AST/ExpressionASTNode";
import { MonadicASTNode } from "../src/AST/MonadicASTNode";
import { OperationType } from "../src/AST/OperationASTNode";
import { Parser } from "../src/Parser";
import { Token, TokenType } from "../src/Token";

function parenWrap(toks: Token[]): Token[] {
    return [new Token(1, 1, TokenType.OpenParen)]
        .concat(toks)
        .concat([new Token(1, 1, TokenType.CloseParen)]);
}

function generateConstant(): Token[] {
    return [
        new Token(1, 1, TokenType.Integer, Math.floor(Math.random() * 5000))
    ];
}

function generateFactor(): Token[] {
    return [
        new Token(1, 1, TokenType.Negation),
        generateConstant()[0]
    ];
}

function generateExpression(opType: TokenType = TokenType.Addition): Token[] {
    return [
        generateConstant()[0],
        new Token(1, 1, opType),
        generateConstant()[0]
    ];
}

describe("Parser", () => {
    describe("Parser.parseOpType()", () => {
        it("should return the corresponding opType when given an operation token", () => {
            for (let tokType in TokenType) {
                if (!OperationType.hasOwnProperty(tokType)) continue;
                if (/^[0-9]+$/.test(tokType)) continue;

                let tok = new Token(1, 1, parseInt(TokenType[tokType]));

                expect(Parser["parseOpType"](tok)).to.equal(OperationType[tokType]);
            }
        });

        it("should throw an error when given a tokenType that has no corresponding operation", () => {
            expect(Parser["parseOpType"].bind(Parser, new Token(1, 1, TokenType.Identifier))).to.throw();
            expect(Parser["parseOpType"].bind(Parser, new Token(1, 1, TokenType.Keyword))).to.throw();
            expect(Parser["parseOpType"].bind(Parser, new Token(1, 1, TokenType.Semicolon))).to.throw();
        });
    });

    describe("Parser.parseFactor()", () => {
        // A factor is a constant, an expression or factor wrapped in parentheses, or a monadic operation
        it("should correctly parse a valid factor", () => {
            let factor = Parser["parseFactor"](generateFactor());
            expect(factor).to.be.an.instanceof(MonadicASTNode);
            factor = Parser["parseFactor"](generateConstant());
            expect(factor).to.be.an.instanceof(ConstantASTNode);
            factor = Parser["parseFactor"](parenWrap(generateFactor()));
            expect(factor).to.be.an.instanceof(ExpressionASTNode);
            factor = Parser["parseFactor"](parenWrap(generateExpression()));
            expect(factor).to.be.an.instanceof(ExpressionASTNode);
        });

        it("should throw an error when given an invalid factor", () => {
            expect(Parser["parseFactor"].bind(Parser, [new Token(1, 1, TokenType.Semicolon)])).to.throw();
            expect(Parser["parseFactor"].bind(Parser, [new Token(1, 1, TokenType.Identifier)])).to.throw();
            expect(Parser["parseFactor"].bind(Parser, [new Token(1, 1, TokenType.OpenBrace)])).to.throw();
            expect(Parser["parseFactor"].bind(Parser, [new Token(1, 1, TokenType.Multiplication)])).to.throw();
        });

        it("should throw an error when given mis-matched parens", () => {
            expect(Parser["parseFactor"].bind(Parser,
                parenWrap(generateExpression().concat([new Token(1, 1, TokenType.Semicolon)]))
            )).to.throw();
        });
    });

    describe("Parser.parseExpression()", () => {
        // An expression is a factor, or a diadic operation
        it("should correctly parse a valid expression", () => {
            let expr = Parser["parseExpression"](generateFactor());
            expect(expr).to.be.an.instanceof(MonadicASTNode);
            expr = Parser["parseExpression"](generateConstant());
            expect(expr).to.be.an.instanceof(ConstantASTNode);
            expr = Parser["parseExpression"](generateExpression());
            expect(expr).to.be.an.instanceof(DiadicASTNode);
            expr = Parser["parseExpression"](parenWrap(generateFactor()));
            expect(expr).to.be.an.instanceof(MonadicASTNode);
            expr = Parser["parseExpression"](parenWrap(generateExpression()));
            expect(expr).to.be.an.instanceof(DiadicASTNode);
        });

        it("should correctly parse sub-factors", () => {
            let tokens = generateExpression(TokenType.Multiplication);
            tokens.pop();
            tokens = tokens.concat(generateFactor());
            let expr: ExpressionASTNode = Parser["parseExpression"](tokens);
            expect(expr).to.be.an.instanceof(DiadicASTNode);
            expect((expr as DiadicASTNode).childNodes[1]).to.be.an.instanceof(MonadicASTNode);
        });
    });
});