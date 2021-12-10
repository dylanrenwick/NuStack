namespace NuStack.Core.Tokens
{
    public class Token
    {
        public int Start { get; set; }
        public int End { get; set; }

        public string Value { get; set; }
        public TokenType Type { get; set; }

        public bool HasValue => false; 
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
        Integer
    }
}
