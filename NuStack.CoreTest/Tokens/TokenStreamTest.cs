using NuStack.Core.Tokens;

namespace NuStack.CoreTest.Tokens
{
    public class TokenStreamTest
    {
        private static readonly string[] testPrograms = new string[]
        {
            "fn main() -> int { return 0; }"
        };

        public static IEnumerable<IEnumerable<Token>> GenerateTestTokens()
        {
            var tokenizer = new Tokenizer();
            var streams = new List<IEnumerable<Token>>();
            foreach (var program in testPrograms)
            {
                streams.Add(tokenizer.Tokenize(program));
            }
            return streams;
        }
        public static IEnumerable<TokenStream> GenerateTestStreams()
        {
            return GenerateTestTokens().Select(
                toks => new TokenStream(toks)
            );
        }
        public static IEnumerable<object[]> Streams
            => GenerateTestStreams().Select(s => new object[] { s });
        public static IEnumerable<object[]> StreamsWithTokens
            => GenerateTestTokens().Zip(
                GenerateTestStreams(),
                (toks, stream) => new object[] { stream, toks }
            );
        public static IEnumerable<object[]> FirstToken_Data
            => GenerateTestTokens().Select(toks => new object[]
            {
                new TokenStream(toks),
                toks.First()
            });

        [Fact]
        public void MoveNext_EmptyStream_ReturnsFalse()
        {
            var tokenStream = new TokenStream(new Token[0]);
            Assert.False(tokenStream.MoveNext());
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void MoveNext_IncrementsCurrentIndex(
            TokenStream stream
        )
        {
            int lastIndex = stream.CurrentIndex;
            Assert.True(stream.MoveNext());
            Assert.Equal(lastIndex + 1, stream.CurrentIndex);
        }

        [Theory]
        [MemberData(nameof(FirstToken_Data))]
        public void MoveNext_NewStream_MovesToFirstToken(
            TokenStream stream,
            Token expectedFirst
        )
        {
            Assert.True(stream.MoveNext());
            Assert.Equal(expectedFirst, stream.Current);
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void MoveNext_EachStream_MovesToNextMatching(TokenStream stream)
        {
            stream.Each(tok => tok.HasValue);
            while (stream.MoveNext()) Assert.True(stream.Current.HasValue);
        }

        [Fact]
        public void Next_EmptyStream_ReturnsFalse()
        {
            var tokenStream = new TokenStream(new Token[0]);
            Assert.False(tokenStream.Next());
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void Next_IncrementsCurrentIndex(TokenStream stream)
        {
            int lastIndex = stream.CurrentIndex;
            Assert.True(stream.Next());
            Assert.Equal(lastIndex + 1, stream.CurrentIndex);
        }

        [Theory]
        [MemberData(nameof(FirstToken_Data))]
        public void Next_NewStream_MovesToFirstToken(
            TokenStream stream,
            Token expectedFirst
        )
        {
            Assert.True(stream.Next());
            Assert.Equal(expectedFirst, stream.Current);
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void Next_EachStream_MovesToNext(TokenStream stream)
        {
            stream.Each(tok => tok.HasValue);
            while (stream.Next() && stream.Current.HasValue);
            Assert.False(stream.IsAtEnd);
        }

        [Fact]
        public void Seek_EmptyStream_ReturnsFalse()
        {
            var tokenStream = new TokenStream(new Token[0]);
            Assert.False(tokenStream.Seek(0));
        }

        [Theory]
        [MemberData(nameof(FirstToken_Data))]
        public void Seek_NewStream_SeeksToIndex(
            TokenStream stream,
            Token expectedFirst
        )
        {
            Assert.True(stream.Seek(0));
            Assert.Equal(expectedFirst, stream.Current);
        }

        [Fact]
        public void CurrentIndex_NewStream_NegativeOne()
        {
            var tokenStream = new TokenStream(new Token[0]);
            Assert.Equal(-1, tokenStream.CurrentIndex);
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void Reset_RestartsIterator(TokenStream stream)
        {
            stream.MoveNext();
            Assert.NotEqual(-1, stream.CurrentIndex);
            stream.Reset();
            Assert.Equal(-1, stream.CurrentIndex);
        }

        [Fact]
        public void Expect_EmptyStream_Throws()
        {
            TokenStream stream = new TokenStream(new Token[0]);
            Assert.Throws<ExpectedTokenException>(
                () => stream.Expect(TokenType.Semicolon)
            );
        }

        [Theory]
        [MemberData(nameof(FirstToken_Data))]
        public void Expect_FirstToken_ReturnsExpectedToken(
            TokenStream stream,
            Token first
        )
        {
            Assert.Equal(first, stream.Expect(first.Type));
        }

        [Theory]
        [MemberData(nameof(FirstToken_Data))]
        public void Expect_NotFirstToken_Throws(
            TokenStream stream,
            Token first
        )
        {
            Array types = Enum.GetValues(typeof(TokenType));
            int nextIndex = ((int)first.Type + 1) % types.Length;
            TokenType otherType = (TokenType?)types.GetValue(nextIndex) ?? TokenType.EOF;
            Assert.Throws<ExpectedTokenException>(() => stream.Expect(otherType));
        }

        [Theory]
        [MemberData(nameof(StreamsWithTokens))]
        public void Expect_EndOfStream_Throws(
            TokenStream stream,
            IEnumerable<Token> tokens
        )
        {
            stream.Seek(tokens.Count());
            Assert.Throws<ExpectedTokenException>(() => stream.Expect(TokenType.Semicolon));
        }

        [Fact]
        public void Each_ReturnsSelf()
        {
            var tokenStream = new TokenStream(new Token[0]);
            Assert.Equal(tokenStream, tokenStream.Each(_ => true));
        }

        [Fact]
        public void EachToken_ReturnsSelf()
        {
            var tokenStream = new TokenStream(new Token[0]);
            Assert.Equal(tokenStream, tokenStream.EachToken(TokenType.EOF));
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void EachToken_SkipsOtherTokens(TokenStream stream)
        {
            stream.EachToken(TokenType.Keyword);
            while (stream.MoveNext())
                Assert.Equal(TokenType.Keyword, stream.Current.Type);
        }

        [Theory]
        [MemberData(nameof(Streams))]
        public void EachToken_MatchesValue(TokenStream stream)
        {
            stream.EachToken(TokenType.Keyword, "int");
            while (stream.MoveNext())
            {
                Assert.Equal(TokenType.Keyword, stream.Current.Type);
                Assert.True(stream.Current.HasValue);
                Assert.Equal("int", stream.Current.Value);
            }
        }

        [Theory]
        [MemberData(nameof(StreamsWithTokens))]
        public void ToList_ReturnsTokensList(
            TokenStream stream,
            IEnumerable<Token> tokens
        )
        {
            Assert.Equal(tokens, stream.ToList());
        }
    }
}
