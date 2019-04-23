import { expect } from "chai";
import { Token, TokenType } from "../src/Token";

function forTokenTypes(callback: (type: TokenType) => void, exceptValueTypes: boolean = false) {
    let valueTypes = [
        TokenType.Keyword, TokenType.Identifier, TokenType.Integer
    ];

    for (let type in TokenType) {
        if (!/^[0-9]+$/.test(type)) continue;

        if (exceptValueTypes && valueTypes.includes(parseInt(type))) continue;

        callback(parseInt(type));
    }
}

describe("Token:", () => {
    describe("Token.constructor()", () => {
        it("should correctly assign row and column values", () => {
            for (let i = 0; i < 5; i++) {
                let line = Math.floor(Math.random() * 15000);
                let col = Math.floor(Math.random() * 15000);
                let token = new Token(col, line, TokenType.Semicolon);
                expect(token).to.satisfy((x: Token) => {
                    return (x.column === col && x.row === line);
                });
            }
        });

        it("should correctly assign tokenType", () => {
            forTokenTypes((i: TokenType) => {
                expect(new Token(1, 1, i).tokenType).to.equal(i);
            });
        });

        it("should correctly assign a value", () => {
            let values = [
                8, "hi", 13948, "67", "no", 23.5, true,
                0, "", false, null // falsey values
            ];

            for (let val of values) {
                let tokType = Math.floor(Math.random() * 10);
                expect(new Token(1, 1, tokType, val).tokenValue).to.equal(val);
            }
        });

        it("shouldn't assign a value if none is given", () => {
            expect(new Token(1, 1, TokenType.Keyword).tokenValue).to.equal(undefined);
            expect(new Token(1, 1, TokenType.Keyword, undefined).tokenValue).to.equal(undefined);
        });
    });

    describe("Token.toString()", () => {
        it("should correctly return the token used to create it", () => {
            let tokenStrings: { [key: string]: TokenType } = {
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
                "&&": TokenType.LogicalAND,
            };

            for (let token in tokenStrings) {
                if (!tokenStrings.hasOwnProperty(token)) continue;
                expect(new Token(1, 1, tokenStrings[token], token)).to.satisfy((x: TokenType) => {
                    return x.toString() === token;
                });
            }
        });

        it("should return an empty string when tokenType is invalid", () => {
            expect(new Token(1, 1, -1).toString()).to.equal("");
        });

        it("should ignore given value when of a singleton tokenType", () => {
            forTokenTypes((type: TokenType) => {
                expect(new Token(1, 1, type, "not right").toString()).to.not.equal("not right");
            }, true);
        });
    });

    describe("Token.hasValue", () => {
        it("should return true if the Token has a value", () => {
            expect(new Token(1, 1, TokenType.Identifier, "test").hasValue).to.be.true;
            expect(new Token(1, 1, TokenType.Keyword, "return").hasValue).to.be.true;
            expect(new Token(1, 1, TokenType.Integer, 42).hasValue).to.be.true;
        });

        it("should return false for value-less tokenTypes", () => {
            forTokenTypes((type: TokenType) => {
                expect(new Token(1, 1, type).hasValue).to.be.false;
            }, true);
        });

        it("should ignore given values for value-less tokenTypes", () => {
            forTokenTypes((type: TokenType) => {
                expect(new Token(1, 1, type, "this is a value").hasValue).to.be.false;
            }, true);
        });

        it("should return false for value tokenTypes that were not given a value", () => {
            expect(new Token(1, 1, TokenType.Identifier).hasValue).to.be.false;
            expect(new Token(1, 1, TokenType.Keyword).hasValue).to.be.false;
            expect(new Token(1, 1, TokenType.Integer).hasValue).to.be.false;
        });
    });
});
