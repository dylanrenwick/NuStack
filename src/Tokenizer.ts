import { Token, TokenType } from "./Token";

export class Tokenizer {
    private static readonly keywords: string[] = [
        "int", "char", "return", "if", "else",
        "while", "break", "continue", "string"
    ];
    private static readonly singletons: string[] = [
        "(", ")", "{", "}", "[", "]", ";", ",", "#"
    ];
    private static readonly separators: string[] = [
        " ", "\t", "\n", "\r",
    ];
    private static readonly operators: string[] = [
        "~", "!", "+", "-", "/", "*", ">", "<", "=",
    ];
    private static readonly twoCharOperators: string[] = [
        "==", "!=", "<=", ">=", "&&", "||", ">-", "-<",
    ];

    public static tokenize(code: string): Token[] {
        let tokens: Token[] = [];

        let curToken: string = "";

        let line = 1;
        let col = 1;

        let str = false;
        let isChar = false;
        let newline = false;

        for (let char of code) {
            if (newline) {
                col = 1;
                line++;
                newline = false;
            }
            if (char === "\n") {
                newline = true;
            }

            col++;

            if (str) {
                if (char === "\"" && !/\\$/.test(curToken.replace(/\\\\/g, ""))) {
                    str = false;
                    tokens.push(new Token(col - curToken.length, line, TokenType.String, curToken));
                    curToken = "";
                    continue;
                } else {
                    curToken += char;
                    continue;
                }
            } else if (char === "\"") {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col - curToken.length, curToken));
                    curToken = "";
                }
                str = true;
                continue;
            }

            if (isChar) {
                if (char === "'") {
                    tokens.push(new Token(col - 3, line, TokenType.Char, curToken));
                    curToken = "";
                    isChar = false;
                } else if (curToken.length > 1) {
                    throw new Error("Char literal must be length 1: " + curToken);
                } else {
                    curToken += char;
                }
                continue;
            } else if (char === "'") {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col - curToken.length, curToken));
                    curToken = "";
                }

                isChar = true;
                continue;
            }

            if (this.twoCharOperators.includes(curToken + char)) {
                curToken += char;
                tokens.push(this.tokenFromString(line, col - curToken.length, curToken));
                curToken = "";
                continue;
            }

            if (this.twoCharOperators.map(x => x[0]).includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col - curToken.length, curToken));
                    curToken = "";
                }

                curToken += char;
                continue;
            }

            if (this.singletons.includes(char) || this.operators.includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col - curToken.length - 1, curToken));
                    curToken = "";
                }

                tokens.push(this.tokenFromString(line, col - 1, char));

                continue;
            }

            if (/[0-9]/.test(char)) {
                if (/^[0-9]+$/.test(curToken)) {
                    curToken += char;
                } else {
                    if (curToken.length > 0) {
                        tokens.push(this.tokenFromString(line, col - curToken.length - 1, curToken));
                    }

                    curToken = char;
                }

                continue;
            }

            if (this.separators.includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col - curToken.length - 1, curToken));
                    curToken = "";
                }

                continue;
            }

            if (/[a-zA-Z_]/.test(char)) {
                curToken += char;
            } else {
                throw new Error("Unknown character: " + char + " at line: " + line + ", col: " + (col - 1));
            }
        }

        if (curToken.length > 0) {
            tokens.push(this.tokenFromString(line, col - curToken.length - 1, curToken));
            curToken = "";
        }

        return tokens;
    }

    private static tokenFromString(line: number, col: number, token: string): Token {
        switch (token) {
            case "{": return new Token(col, line, TokenType.OpenBrace);
            case "}": return new Token(col, line, TokenType.CloseBrace);
            case "(": return new Token(col, line, TokenType.OpenParen);
            case ")": return new Token(col, line, TokenType.CloseParen);
            case "[": return new Token(col, line, TokenType.OpenBrack);
            case "]": return new Token(col, line, TokenType.CloseBrack);
            case ";": return new Token(col, line, TokenType.Semicolon);
            case ",": return new Token(col, line, TokenType.Comma);
            case "-": return new Token(col, line, TokenType.Negation);
            case "~": return new Token(col, line, TokenType.BitwiseNOT);
            case "!": return new Token(col, line, TokenType.LogicalNOT);
            case "+": return new Token(col, line, TokenType.Addition);
            case "*": return new Token(col, line, TokenType.Multiplication);
            case "/": return new Token(col, line, TokenType.Division);
            case "#": return new Token(col, line, TokenType.Macro);
            case ">": return new Token(col, line, TokenType.MoreThan);
            case "<": return new Token(col, line, TokenType.LessThan);
            case "=": return new Token(col, line, TokenType.Assignment);
            case "==": return new Token(col, line, TokenType.Equal);
            case "!=": return new Token(col, line, TokenType.NotEqual);
            case ">=": return new Token(col, line, TokenType.MoreThanEqual);
            case "<=": return new Token(col, line, TokenType.LessThanEqual);
            case "||": return new Token(col, line, TokenType.LogicalOR);
            case "&&": return new Token(col, line, TokenType.LogicalAND);
            case ">-": return new Token(col, line, TokenType.Dereference);
            case "-<": return new Token(col, line, TokenType.Reference);
        }

        if (/^[0-9]+$/.test(token)) {
            return new Token(col, line, TokenType.Integer, parseInt(token));
        }

        if (this.keywords.includes(token)) {
            return new Token(col, line, TokenType.Keyword, token);
        }

        if (/^[a-zA-Z_]+$/.test(token)) {
            return new Token(col, line, TokenType.Identifier, token);
        }

        throw new Error("Could not lex token " + token + " at line: " + line + ", col: " + col);
    }
}
