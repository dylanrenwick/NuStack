using System.Text.RegularExpressions;

namespace NuStack.Core.Tokens
{
    public class Tokenizer
    {
        private static readonly string[] keywords = new string[]
        {
            "int", "return"
        };

        private string sourceCode;

        private int currentLine;
        private int currentColumn;
        private int sourcePosition;

        private bool endOfFile => sourcePosition >= sourceCode.Length;
        private bool nextIsWhitespace => peek() == ' ';

        public Tokenizer()
        {
            initialize();
        }

        public IEnumerable<Token> Tokenize(string source)
        {
            initialize();
            sourceCode = source.Trim();

            var tokens = new List<Token>();

            while (!endOfFile)
            {
                Token token = nextToken();
                tokens.Add(token);
                skipWhitespace();
            }

            return tokens;
        }

        private void initialize()
        {
            currentLine = 0;
            currentColumn = 0;
            sourcePosition = 0;
        }

        private Token nextToken()
        {
            if (tryGetSingleton(out Token singletonToken)) return singletonToken;
            else if (tryGetInteger(out Token integerToken)) return integerToken;
            else if (tryGetKeyword(out Token keywordToken)) return keywordToken;
            else if (tryGetIdentifier(out Token identifierToken)) return identifierToken;
            else throw new InvalidTokenException(peek());
        }

        private bool tryGetSingleton(out Token token)
        {
            if (Token.CharIsSingleton(peek()))
            {
                token = Token.Singleton(consume(), sourcePosition - 1);
                return true;
            }

            token = null;
            return false;
        }
        private bool tryGetKeyword(out Token token)
        {
            token = null;
            string matchingKeyword = keywords
                .Where(str => 
                    sourceCode.Length - sourcePosition >= str.Length
                    && sourceCode.Substring(sourcePosition, str.Length) == str
                ).OrderByDescending(str => str.Length)
                .FirstOrDefault(string.Empty);

            if (string.IsNullOrEmpty(matchingKeyword)) return false;

            token = new Token
            {
                Start = sourcePosition,
                End = sourcePosition + matchingKeyword.Length,
                Value = matchingKeyword,
                Type = TokenType.Keyword
            };
            sourcePosition = token.End;
            return true;
        }
        private bool tryGetInteger(out Token token)
        {
            return tryWhile(TokenType.Integer, out token, nextIsNumeric);
        }
        private bool tryGetIdentifier(out Token token)
        {
            return tryWhile(TokenType.Identifier, out token, nextIsIdentifier);
        }
        private bool tryWhile(TokenType tokenType, out Token token, Func<bool> predicate)
        {
            int start = sourcePosition;
            token = null;
            string tokenValue = consumeWhile(predicate);
            if (tokenValue.Length == 0) return false;

            token = new Token
            {
                Start = start,
                End = sourcePosition,
                Value = tokenValue,
                Type = tokenType,
            };
            return true;
        }

        private void skipWhitespace()
        {
            while (!endOfFile && nextIsWhitespace) sourcePosition++;
        }

        private bool nextIsNumeric()
        {
            return new Regex("[0-9]").IsMatch(peek().ToString());
        }
        private bool nextIsIdentifier()
        {
            return new Regex("[a-zA-Z_]").IsMatch(peek().ToString());
        }

        private char peek()
        {
            return sourceCode[sourcePosition];
        }
        private char consume()
        {
            return sourceCode[sourcePosition++];
        }
        private string consumeWhile(Func<bool> predicate)
        {
            string val = string.Empty;
            while (!endOfFile && predicate()) val += consume();
            return val;
        }
    }
}
