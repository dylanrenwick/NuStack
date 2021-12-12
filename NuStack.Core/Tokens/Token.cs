namespace NuStack.Core.Tokens
{
    public class Token
    {
        public int Start { get; set; }
        public int End { get; set; }

        public string Value { get; set; }
        public TokenType Type { get; set; }

        public Token() { }

        public Token(int start, TokenType type, string value = null)
        {
            Start = start;
            Type = type;
            Value = value;
            End = start + (value == null ? 1 : value.Length);
        }

        public bool HasValue => Type switch
        {
            TokenType.Keyword or
            TokenType.Identifier or
            TokenType.Integer => Value != null && Value.Length > 0,
            _ => false
        };

        public override string ToString()
        {
            return HasValue ? Value : Type.ToString();
        }

        public override bool Equals(object obj)
        {
            if (obj is Token other)
                return Equals(other);
            return false;
        }
        public bool Equals(Token other)
        {
            return other != null
                && Start == other.Start
                && End == other.End
                && HasValue == other.HasValue
                && (HasValue ? Value == other.Value : true)
                && Type == other.Type;
        }
    }

    public enum TokenType
    {
        Keyword,
        Identifier,
        OpenParen,
        CloseParen,
        OpenBrace,
        CloseBrace,
        Semicolon,
        NewLine,
        Integer,
        ReturnArrow
    }
}
