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

        public bool IsAtEnd => current >= tokens.Count;

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

        public bool Seek(int to)
        {
            current = Math.Max(to, 0);
            return !IsAtEnd;
        }

        public Token Expect(TokenType expectedType)
        {
            Token next = Peek();
            if (next == null || next.Type != expectedType)
                throw new ExpectedTokenException(
                    expectedType,
                    next == null ? TokenType.EOF : next.Type,
                    next == null ? (Current?.Line ?? -1) : next.Line,
                    next == null ? ((Current?.Column + Current?.Length) ?? -1) : next.Column
                );
            current++;
            return next;
        }
        public Token Expect(TokenType expectedType, string expectedValue)
        {
            Token next = Expect(expectedType);
            if (!next.HasValue || !next.Value.Equals(expectedValue))
                throw new ExpectedTokenException(
                    expectedType,
                    next == null ? TokenType.EOF : next.Type,
                    next == null ? (Current?.Line ?? -1) : next.Line,
                    next == null ? ((Current?.Column + Current?.Length) ?? -1) : next.Column
                );
            return next;
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
    }
}
