using System.Text.RegularExpressions;

namespace NuStack.Core.Tokens
{
    public class Tokenizer
    {
        private static readonly Dictionary<string, TokenType> staticTokens = new Dictionary<string, TokenType>()
        {
            {"(", TokenType.OpenParen}, {")", TokenType.CloseParen},
            {"{", TokenType.OpenBrace}, {"}", TokenType.CloseBrace},
            {";", TokenType.Semicolon}, {"\n", TokenType.NewLine },
            {"->", TokenType.ReturnArrow }
        };

        private static readonly string[] keywords = new string[]
        {
            "fn", "int", "return"
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
            sourceCode = source.Trim(' ');

            var tokens = new List<Token>();

            while (!endOfFile)
            {
                Token token = nextToken();
                tokens.Add(token);
                currentColumn += token.Length;
                if (token.Type == TokenType.NewLine)
                {
                    currentColumn = 0;
                    currentLine++;
                }
                skipWhitespace();
            }

            return tokens;
        }

        private void initialize()
        {
            currentLine = 1;
            currentColumn = 0;
            sourcePosition = 0;
        }

        private Token nextToken()
        {
            if (tryGetStaticToken(out Token staticToken)) return staticToken;
            else if (tryGetInteger(out Token integerToken)) return integerToken;
            else if (tryGetKeyword(out Token keywordToken)) return keywordToken;
            else if (tryGetIdentifier(out Token identifierToken)) return identifierToken;
            else throw new InvalidTokenException(peek(), currentLine, currentColumn);
        }

        private bool tryGetStaticToken(
            out Token token,
            string part = "",
            int startPosition = -1
        )
        {
            token = null;
            int prevPosition = sourcePosition;
            if (startPosition < 0) startPosition = prevPosition;

            string nextPart = part + consume();

            string possibleStaticToken = staticTokens
                .Keys.Where(key => key.StartsWith(nextPart))
                .OrderByDescending(key => key.Length)
                .FirstOrDefault(string.Empty);

            if (!string.IsNullOrEmpty(possibleStaticToken))
            {
                if (possibleStaticToken.Length > nextPart.Length
                    && tryGetStaticToken(out token, nextPart, startPosition))
                    return true;
                else if (possibleStaticToken.Length == nextPart.Length)
                {
                    token = new Token(
                        currentLine, currentColumn, startPosition,
                        staticTokens[possibleStaticToken], possibleStaticToken
                    );
                    return true;
                }
            }

            sourcePosition = prevPosition;
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

            token = new Token(
                currentLine,
                currentColumn,
                sourcePosition,
                TokenType.Keyword,
                matchingKeyword
            );
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

            token = new Token(
                currentLine,
                currentColumn,
                start,
                tokenType,
                tokenValue
            );
            return true;
        }

        private void skipWhitespace()
        {
            while (!endOfFile && nextIsWhitespace)
            {
                sourcePosition++;
                currentColumn++;
            }
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
