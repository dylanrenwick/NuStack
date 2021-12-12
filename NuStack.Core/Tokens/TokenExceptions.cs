namespace NuStack.Core.Tokens
{
    public class InvalidTokenException: Exception
    {
        private const string errorFormat = "Could not tokenize character '{0}' at Line {1}, col {2}";

        public InvalidTokenException(char found, int lineNo, int colNo)
            : base(string.Format(errorFormat, found, lineNo, colNo)) { }
    }
}
