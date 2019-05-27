export class Token  {
    public tokenType: TokenType;
    public tokenValue: any;

    public column: number;
    public row: number;

    public get hasValue(): boolean {
        switch (this.tokenType) {
            case TokenType.Keyword:
            case TokenType.Identifier:
            case TokenType.Integer:
            case TokenType.Char:
            case TokenType.String:
                return this.tokenValue !== null && this.tokenValue !== undefined;
            default:
                return false;
        }
    }

    public constructor(col: number, row: number, type: TokenType, value?: any) {
        this.column = col;
        this.row = row;
        this.tokenType = type;
        if (value !== undefined) this.tokenValue = value;
    }

    public toString(): string {
        switch (this.tokenType) {
            case TokenType.Keyword:
            case TokenType.Identifier:
            case TokenType.Sigil:
            case TokenType.Integer:
            case TokenType.Char:
            case TokenType.String:
                return this.tokenValue.toString();
            case TokenType.OpenParen: return "(";
            case TokenType.CloseParen: return ")";
            case TokenType.OpenBrace: return "{";
            case TokenType.CloseBrace: return "}";
            case TokenType.OpenBrack: return "[";
            case TokenType.CloseBrack: return "]";
            case TokenType.Semicolon: return ";";
            case TokenType.Colon: return ":";
            case TokenType.Comma: return ",";
            case TokenType.Negation: return "-";
            case TokenType.BitwiseNOT: return "~";
            case TokenType.LogicalNOT: return "!";
            case TokenType.Addition: return "+";
            case TokenType.Multiplication: return "*";
            case TokenType.Division: return "/";
            case TokenType.Macro: return "#";
            case TokenType.MoreThan: return ">";
            case TokenType.LessThan: return "<";
            case TokenType.Equal: return "==";
            case TokenType.NotEqual: return "!=";
            case TokenType.MoreThanEqual: return ">=";
            case TokenType.LessThanEqual: return "<=";
            case TokenType.LogicalOR: return "||";
            case TokenType.LogicalAND: return "&&";
            case TokenType.Assignment: return "=";
            case TokenType.Dereference: return "-<";
            case TokenType.Reference: return ">-";
            default: return "";
        }
    }
}

export enum TokenType {
    Keyword,
    Identifier,
    Sigil,
    OpenParen,
    CloseParen,
    OpenBrace,
    CloseBrace,
    OpenBrack,
    CloseBrack,
    Semicolon,
    Colon,
    Comma,
    Integer,
    Char,
    String,
    Negation,
    BitwiseNOT,
    LogicalNOT,
    Addition,
    Multiplication,
    Division,
    Macro,
    MoreThan,
    LessThan,
    Equal,
    NotEqual,
    MoreThanEqual,
    LessThanEqual,
    LogicalOR,
    LogicalAND,
    Assignment,
    Dereference,
    Reference
}
