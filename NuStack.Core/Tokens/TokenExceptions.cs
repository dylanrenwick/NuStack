namespace NuStack.Core.Tokens
{
    public class ExpectedTokenException : Exception
    {
        private const string errorFormat = "Expected token '{0}' but found '{1}' at Line: {2}, col {3}";

        public ExpectedTokenException(TokenType expected, TokenType found, int lineNo, int colNo)
            : base(string.Format(errorFormat, expected, found, lineNo, colNo)) { }
    }

    public class InvalidTokenException: Exception
    {
        private const string errorFormat = "Could not tokenize character '{0}' at Line {1}, col {2}";

        public InvalidTokenException(char found, int lineNo, int colNo)
            : base(string.Format(errorFormat, found, lineNo, colNo)) { }
    }
}
