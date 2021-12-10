namespace NuStack.Core.Tokens
{
    public class ExpectedTokenException : Exception
    {
        private const string errorFormat = "Expected '{0}' but found '{1}'";

        public ExpectedTokenException(char[] expected, string found)
            : base(string.Format(errorFormat, string.Join('|', expected), found)) { }
        public ExpectedTokenException(char[] expected, char found)
            : base(string.Format(errorFormat, string.Join('|', expected), found)) { }
    }

    public class InvalidTokenException: Exception
    {
        private const string errorFormat = "Could not tokenize character '{0}'";

        public InvalidTokenException(char found)
            : base(string.Format(errorFormat, found)) { }
    }
}
