export class Token  {
    public tokenType: TokenType;
    public tokenValue: any;

    public get hasValue(): boolean {
        switch (this.tokenType) {
            case TokenType.Keyword:
            case TokenType.Identifier:
            case TokenType.Integer:
                return this.tokenValue !== null && this.tokenValue !== undefined;
            default:
                return false;
        }
    }

    public constructor(type: TokenType, value?: any) {
        this.tokenType = type;
        if (!value !== undefined) this.tokenValue = value;
    }

    public toString(): string {
        switch (this.tokenType) {
            case TokenType.Keyword:
            case TokenType.Identifier:
            case TokenType.Integer:
                return this.tokenValue.toString();
            case TokenType.OpenParen:
                return "(";
            case TokenType.CloseParen:
                return ")";
            case TokenType.OpenBrace:
                return "{";
            case TokenType.CloseBrace:
                return "}";
            case TokenType.Semicolon:
                return ";";
            default:
                return "";//this.tokenType.toString();
        }
    }
}

export enum TokenType {
    Keyword,
    Identifier,
    OpenParen,
    CloseParen,
    OpenBrace,
    CloseBrace,
    Semicolon,
    Integer,
}