using System;
using System.Collections.Generic;
using System.Text;

namespace NuStack.Core.Tokens
{
    internal class Tokenizer
    {
        private string sourceCode;
        private string currentToken;

        private int currentLine;
        private int currentColumn;
        private int sourcePosition;

        private bool endOfFile => sourcePosition == sourceCode.Length;

        public Tokenizer()
        {
            initialize();
        }

        public Token[] Tokenize(string source)
        {
            initialize();
            sourceCode = source;

            return new Token[0];
        }

        private void initialize()
        {
            currentToken = string.Empty;

            currentLine = 0;
            currentColumn = 0;
            sourcePosition = 0;
        }

        private char peek()
        {
            return sourceCode[sourcePosition];
        }
        private char consume(params char[] expected)
        {
            if (endOfFile) error($"Expected one of ");
        }

        private void error(string errorMessage)
        {
            throw new Exception(errorMessage);
        }
    }
}
