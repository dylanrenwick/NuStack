using System.Collections;

namespace NuStack.Core.Tokens
{
    public class TokenStream : IEnumerator<Token>
    {
        public Token Current => tokens[current];
        public int CurrentIndex => current;

        private static readonly Func<Token, bool> truePredicate = t => true;

        private List<Token> tokens;
        private int current;

        private Func<Token, bool> predicate = truePredicate;

        private bool atEnd => current == tokens.Count;

        object IEnumerator.Current => tokens[current];

        public TokenStream(IEnumerable<Token> tokenList)
        {
            tokens = tokenList.ToList();
            current = -1;
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
            do current++; while (!atEnd && !predicate(Current));
            return !atEnd;
        }

        public bool Next()
        {
            current++;
            return !atEnd;
        }

        public bool Seek(int to)
        {
            current = Math.Max(to, 0);
            return !atEnd;
        }

        public Token Expect(TokenType expectedType)
        {
            Token next = peek();
            if (next == null || next.Type != expectedType)
                throw new ExpectedTokenException(
                    expectedType,
                    next == null ? TokenType.EOF : next.Type,
                    next == null ? Current.Line : next.Line,
                    next == null ? Current.Column + Current.Length : next.Column
                );
            current++;
            return next;
        }

        public void Reset()
        {
            current = -1;
        }

        public void Dispose() { }

        private Token peek()
        {
            if (current + 1 < tokens.Count) return tokens[current + 1];
            return null;
        }
    }
}
