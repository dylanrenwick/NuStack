const expect = require('chai').expect;
const _Token = require("../bin/Token");
const Token = _Token.Token;
const TokenType = _Token.TokenType;

describe("Token.constructor()", function() {
    it("should correctly assign row and column values", function() {
        for (let i = 0; i < 5; i++) {
            let line = Math.floor(Math.random() * 15000), col = Math.floor(Math.random() * 15000);
            let token = new Token(col, line, TokenType.Semicolon);
            expect(token).to.satisfy(function(x) {
                return (x.column === col && x.row === line);
            });
        }
    });

    it("should correctly assign tokenType", function() {
        for (let i = 0; i < 10; i++) {
            expect(new Token(1, 1, i).tokenType).to.equal(i);
        }
    })
});

describe("Token.toString()", function() {
    it("should correctly return the token used to create it", function() {
        let tokenStrings = {
            "int": TokenType.Keyword,
            "return": TokenType.Keyword,
            "main": TokenType.Identifier,
            "myVar": TokenType.Identifier,
            "7": TokenType.Integer,
            "4": TokenType.Integer,
            "15": TokenType.Integer,
            "4892": TokenType.Integer,
            "(": TokenType.OpenParen,
            ")": TokenType.CloseParen,
            "{": TokenType.OpenBrace,
            "}": TokenType.CloseBrace,
            ";": TokenType.Semicolon,
            "~": TokenType.BitwiseNOT,
            "!": TokenType.LogicalNOT,
            "+": TokenType.Addition,
            "-": TokenType.Negation,
            "*": TokenType.Multiplication,
            "/": TokenType.Division,
            ">": TokenType.MoreThan,
            "<": TokenType.LessThan,
            "==": TokenType.Equal,
            "!=": TokenType.NotEqual,
            ">=": TokenType.MoreThanEqual,
            "<=": TokenType.LessThanEqual,
            "||": TokenType.LogicalOR,
            "&&": TokenType.LogicalAND
        };

        for (let token in tokenStrings) {
            expect(new Token(1, 1, tokenStrings[token], token)).to.satisfy(function(x) {
                return x.toString() === token;
            });
        }
    });

    it("should return an empty string when tokenType is invalid", function() {
        expect(new Token(1, 1, -1).toString()).to.equal("");
    });
});

describe("Token.hasValue", function() {
    it("should return true if the Token has a value", function() {
        expect(new Token(1, 1, TokenType.Identifier, "test").hasValue).to.be.true;
        expect(new Token(1, 1, TokenType.Keyword, "return").hasValue).to.be.true;
        expect(new Token(1, 1, TokenType.Integer, 42).hasValue).to.be.true;
    });

    it("should return false for value-less tokenTypes", function() {
        let types = [
            TokenType.OpenParen, TokenType.CloseParen, TokenType.OpenBrace,
            TokenType.CloseBrace, TokenType.Semicolon, TokenType.BitwiseNOT,
            TokenType.LogicalNOT, TokenType.Addition, TokenType.Negation,
            TokenType.Multiplication, TokenType.Division, TokenType.MoreThan,
            TokenType.LessThan, TokenType.Equal, TokenType.NotEqual,
            TokenType.MoreThanEqual, TokenType.LessThanEqual,TokenType.LogicalOR,
            TokenType.LogicalAND
        ];

        for (let type of types) {
            expect(new Token(1, 1, type).hasValue).to.be.false;
        }
    });

    it("should ignore given values for value-less tokenTypes", function() {
        let types = [
            TokenType.OpenParen, TokenType.CloseParen, TokenType.OpenBrace,
            TokenType.CloseBrace, TokenType.Semicolon, TokenType.BitwiseNOT,
            TokenType.LogicalNOT, TokenType.Addition, TokenType.Negation,
            TokenType.Multiplication, TokenType.Division, TokenType.MoreThan,
            TokenType.LessThan, TokenType.Equal, TokenType.NotEqual,
            TokenType.MoreThanEqual, TokenType.LessThanEqual,TokenType.LogicalOR,
            TokenType.LogicalAND
        ];

        for (let type of types) {
            expect(new Token(1, 1, type, "this is a value").hasValue).to.be.false;
        }
    })

    it("should return false for value tokenTypes that were not given a value", function() {
        expect(new Token(1, 1, TokenType.Identifier).hasValue).to.be.false;
        expect(new Token(1, 1, TokenType.Keyword).hasValue).to.be.false;
        expect(new Token(1, 1, TokenType.Integer).hasValue).to.be.false;
    })
});