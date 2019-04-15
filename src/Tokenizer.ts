import { Token, TokenType } from "./Token";

export class Tokenizer {
    private static readonly keywords: string[] = [
        "int", "return",
    ];
    private static readonly singletons: string[] = [
        "(", ")", "{", "}", ";",
    ];
    private static readonly separators: string[] = [
        " ", "\t", "\n",
    ];

    public static tokenize(code: string): Token[] {
        let tokens: Token[] = [];

        let curToken: string = "";

        for (let char of code) {
            if (this.singletons.includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(curToken));
                    curToken = "";
                }

                tokens.push(this.tokenFromString(char));

                continue;
            }

            if (/[0-9]/.test(char)) {
                if (/^[0-9]$/.test(curToken)) {
                    curToken += char;
                } else {
                    if (curToken.length > 0) {
                        tokens.push(this.tokenFromString(curToken));
                    }

                    curToken = char;
                }

                continue;
            }

            if (this.separators.includes(char)) {
                if (curToken.length > 0) {
                    tokens.push(this.tokenFromString(curToken));
                    curToken = "";
                }

                continue;
            }

            if (/[a-zA-Z_]/.test(char)) {
                curToken += char;
            } else {
                throw new Error("Unknown character: " + char);
            }
        }

        return tokens;
    }

    private static tokenFromString(token: string): Token {
        switch (token) {
            case "{": return new Token(TokenType.OpenBrace);
            case "}": return new Token(TokenType.CloseBrace);
            case "(": return new Token(TokenType.OpenParen);
            case ")": return new Token(TokenType.CloseParen);
            case ";": return new Token(TokenType.Semicolon);
        }

        if (/^[0-9]+$/.test(token)) {
            return new Token(TokenType.Integer, parseInt(token));
        }

        if (this.keywords.includes(token)) {
            return new Token(TokenType.Keyword, token);
        }

        if (/^[a-zA-Z_]+$/.test(token)) {
            return new Token(TokenType.Identifier, token);
        }

        throw new Error("Could not lex token " + token);
    }
}