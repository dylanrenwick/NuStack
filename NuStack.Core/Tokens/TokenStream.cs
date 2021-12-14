using System.Collections;

namespace NuStack.Core.Tokens
{
    public class TokenStream : IEnumerator<Token>
    {
        public Token Current => current < 0 ? null : IsAtEnd ? tokens.Last() : tokens[current];
        public int CurrentIndex => current;

        private static readonly Func<Token, bool> truePredicate = t => true;

        private List<Token> tokens;
        private int current;

        private Func<Token, bool> predicate = truePredicate;

        public bool IsAtEnd => tokens.Count == 0 || current >= tokens.Count;

        object IEnumerator.Current => tokens[current];

        public TokenStream(IEnumerable<Token> tokenList)
        {
            tokens = tokenList.ToList();
            current = -1;
        }

        public List<Token> ToList()
        {
            return tokens;
        }

        public TokenStream Each(Func<Token, bool> pred)
        {
            predicate = pred;
            Reset();
            return this;
        }
        public TokenStream EachToken(
            TokenType type,
            string value = ""
        )
        {
            return Each(t => t.Type == type
                && (string.IsNullOrEmpty(value)
                    || (t.HasValue && t.Value == value))
            );
        }

        public bool MoveNext()
        {
            do current++; while (!IsAtEnd && !predicate(Current));
            return !IsAtEnd;
        }

        public bool Next()
        {
            current++;
            return !IsAtEnd;
        }

        public bool SeekTo(int to)
        {
            current = Math.Max(to, 0);
            return !IsAtEnd;
        }
        public bool Seek(int by)
        {
            return SeekTo(current + by);
        }

        public Token Expect(TokenType expectedType)
        {
            if (Current == null || Current.Type != expectedType)
                throwExpectedTokenException(expectedType, Current);
            Token tok = Current;
            current++;
            return tok;
        }
        public Token Expect(TokenType expectedType, string expectedValue)
        {
            Token tok = Expect(expectedType);
            if (!tok.HasValue || tok.Value != expectedValue)
                throwExpectedTokenException(expectedType, tok);
            return tok;
        }

        public bool CurrentIs(TokenType expectedType)
        {
            return Current != null
                && Current.Type == expectedType;
        }
        public bool CurrentIsPattern(params TokenType[] expectedTypes)
        {
            bool matches = true;
            int i = 0;
            for (; i < expectedTypes.Length; i++,Next())
            {
                if (Current == null || Current.Type != expectedTypes[i])
                {
                    matches = false;
                    break;
                }
            }
            Seek(-i);
            return matches;
        }


        public void Reset()
        {
            current = -1;
        }

        public void Dispose() { }

        public Token Peek()
        {
            if (current + 1 < tokens.Count) return tokens[current + 1];
            return null;
        }

        private void throwExpectedTokenException(TokenType expectedType, Token tok)
        {
            throw new ExpectedTokenException(
                expectedType,
                tok == null ? TokenType.EOF : tok.Type,
                tok == null ? -1 : tok.Line,
                tok == null ? -1 : tok.Column
            );
        }
    }
}
