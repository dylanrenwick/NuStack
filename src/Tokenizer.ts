import { Token, TokenType } from "./Token";

export class Tokenizer {
    private static readonly keywords: string[] = [
        "int", "return",
    ];
    private static readonly singletons: string[] = [
        "(", ")", "{", "}", ";",
    ];
    private static readonly separators: string[] = [
        " ", "\t", "\n", "\r",
    ];
    private static readonly operators: string[] = [
        "~", "!", "+", "-", "/", "*", ">", "<",
    ];
    private static readonly twoCharOperators: string[] = [
        "==", "!=", "<=", ">=", "&&", "||",
    ];

    public static tokenize(code: string): Token[] {
        let tokens: Token[] = [];

        let curToken: string = "";

        let line = 1;
        let col = 0;

        for (let char of code) {
            col++;

            if (this.twoCharOperators.includes(curToken + char)) {
                tokens.push(this.tokenFromString(line, col, curToken + char));
                curToken = "";
                continue;
            }

            if (this.twoCharOperators.map(x => x[0]).includes(char)) {
                if (curToken.length > 0) {
                    if (curToken === "=" && char === "=") {
                        curToken += char;
                    }

                    tokens.push(this.tokenFromString(line, col, curToken));
                    curToken = "";
                }

                curToken += char;
                continue;
            }

            if (this.singletons.includes(char) || this.operators.includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col, curToken));
                    curToken = "";
                }

                tokens.push(this.tokenFromString(line, col, char));

                continue;
            }

            if (/[0-9]/.test(char)) {
                if (/^[0-9]+$/.test(curToken)) {
                    curToken += char;
                } else {
                    if (curToken.length > 0) {
                        tokens.push(this.tokenFromString(line, col, curToken));
                    }

                    curToken = char;
                }

                continue;
            }

            if (this.separators.includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(line, col, curToken));
                    curToken = "";
                }

                if (char === "\n") {
                    line++;
                    col = 0;
                }

                continue;
            }

            if (/[a-zA-Z_]/.test(char)) {
                curToken += char;
            } else {
                throw new Error("Unknown character: " + char + " at line: " + line + ", col: " + col);
            }
        }

        return tokens;
    }

    private static tokenFromString(line: number, col: number, token: string): Token {
        switch (token) {
            case "{": return new Token(col, line, TokenType.OpenBrace);
            case "}": return new Token(col, line, TokenType.CloseBrace);
            case "(": return new Token(col, line, TokenType.OpenParen);
            case ")": return new Token(col, line, TokenType.CloseParen);
            case ";": return new Token(col, line, TokenType.Semicolon);
            case "-": return new Token(col, line, TokenType.Negation);
            case "~": return new Token(col, line, TokenType.BitwiseNOT);
            case "!": return new Token(col, line, TokenType.LogicalNOT);
            case "+": return new Token(col, line, TokenType.Addition);
            case "-": return new Token(col, line, TokenType.Subtraction);
            case "*": return new Token(col, line, TokenType.Multiplication);
            case "/": return new Token(col, line, TokenType.Division);
            case ">": return new Token(col, line, TokenType.MoreThan);
            case "<": return new Token(col, line, TokenType.LessThan);
            case "==": return new Token(col, line, TokenType.Equal);
            case "!=": return new Token(col, line, TokenType.NotEqual);
            case ">=": return new Token(col, line, TokenType.MoreThanEqual);
            case "<=": return new Token(col, line, TokenType.LessThanEqual);
            case "||": return new Token(col, line, TokenType.LogicalOR);
            case "&&": return new Token(col, line, TokenType.LogicalAND);
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
