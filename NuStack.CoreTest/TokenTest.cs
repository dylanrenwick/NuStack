using NuStack.Core.Tokens;

namespace NuStack.CoreTest
{
    public class TokenTest
    {
        [Theory]
        [InlineData(TokenType.OpenParen, "", false)]
        [InlineData(TokenType.OpenParen, "bad val", false)]
        [InlineData(TokenType.Identifier, "val", true)]
        [InlineData(TokenType.Identifier, "", false)]
        [InlineData(TokenType.Identifier, null, false)]
        public void HasValue_ReturnsWhetherTokenHasValue(
            TokenType type,
            string value,
            bool expected
        )
        {
            var token = new Token
            {
                Start = 0,
                End = 1,
                Value = value,
                Type = type
            };

            Assert.Equal(expected, token.HasValue);
        }

        [Fact]
        public void Equals_SameToken_ReturnsTrue()
        {
            var token = new Token
            {
                Start = 0,
                End = 1,
                Value = "",
                Type = TokenType.OpenParen,
            };

            Assert.True(token.Equals(token));
        }

        public static IEnumerable<object[]> CompareToken_Data => new List<object[]>
        {
            new object[] {
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Keyword },
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Keyword },
                true
            },
            new object[] {
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Keyword },
                new Token { Start = 1, End = 3, Value = "int", Type = TokenType.Keyword },
                false
            },
            new object[] {
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Keyword },
                new Token { Start = 0, End = 2, Value = "int", Type = TokenType.Keyword },
                false
            },
            new object[] {
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Keyword },
                new Token { Start = 0, End = 3, Value = "in", Type = TokenType.Keyword },
                false
            },
            new object[] {
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Keyword },
                new Token { Start = 0, End = 3, Value = "int", Type = TokenType.Identifier },
                false
            },
        };

        [Fact]
        public void Equals_WithNonToken_ReturlsFalse()
        {
            var token = new Token(0, TokenType.Keyword, "int");

            Assert.False(token.Equals(null));
            Assert.False(token.Equals("not a token"));
            Assert.False(token.Equals(4743));
            Assert.False(token.Equals(new List<string>()));
            Assert.False(token.Equals(true));
        }

        [Theory]
        [MemberData(nameof(CompareToken_Data))]
        public void Equals_ComparesTokens(
            Token first,
            Token second,
            bool expected
        )
        {
            Assert.Equal(expected, first.Equals(second));
        }

        public static IEnumerable<object[]> NonValueTypesWithValues_Data => new List<object[]>
        {
            new object[] {
                new Token { Start = 0, End = 1, Value = null, Type = TokenType.OpenParen },
                new Token { Start = 0, End = 1, Value = "(", Type = TokenType.OpenParen },
            },
            new object[] {
                new Token { Start = 0, End = 1, Value = ")", Type = TokenType.CloseParen },
                new Token { Start = 0, End = 1, Value = "(", Type = TokenType.CloseParen },
            },
        };

        [Theory]
        [MemberData(nameof(NonValueTypesWithValues_Data))]
        public void Equals_NonValueTypesWithValues_IgnoresValues(
            Token first,
            Token second
        )
        {
            Assert.Equal(first, second);
        }

        public static IEnumerable<object[]> SingletonToken_Data => new List<object[]>
        {
            new object[] {
                '(',
                new Token { Start = 0, End = 1, Value = "(", Type = TokenType.OpenParen },
            },
            new object[] {
                ')',
                new Token { Start = 0, End = 1, Value = ")", Type = TokenType.CloseParen },
            },
            new object[] {
                '{',
                new Token { Start = 0, End = 1, Value = "{", Type = TokenType.OpenBrace },
            },
            new object[] {
                '}',
                new Token { Start = 0, End = 1, Value = "}", Type = TokenType.CloseBrace },
            },
        };

        [Theory]
        [InlineData(TokenType.Identifier, "val")]
        [InlineData(TokenType.Keyword, "keywd")]
        [InlineData(TokenType.Integer, "int")]
        public void ToString_ValueTypeWithValue_ReturnsValue(
            TokenType type,
            string value
        )
        {
            var token = new Token
            {
                Start = 0,
                End = 1,
                Value = value,
                Type = type
            };

            Assert.Equal(value, token.ToString());
        }

        [Theory]
        [InlineData(TokenType.Identifier, "Identifier")]
        [InlineData(TokenType.Keyword, "Keyword")]
        [InlineData(TokenType.Integer, "Integer")]
        public void ToString_ValueTypeWithoutValue_ReturnsType(
           TokenType type,
           string expected
        )
        {
            var token = new Token
            {
                Start = 0,
                End = 1,
                Value = null,
                Type = type
            };

            Assert.Equal(expected, token.ToString());
        }

        [Theory]
        [InlineData(TokenType.OpenParen, "OpenParen")]
        [InlineData(TokenType.CloseParen, "CloseParen")]
        [InlineData(TokenType.OpenBrace, "OpenBrace")]
        [InlineData(TokenType.CloseBrace, "CloseBrace")]
        public void ToString_NonValueType_ReturnsType(
           TokenType type,
           string expected
        )
        {
            var token = new Token
            {
                Start = 0,
                End = 1,
                Value = null,
                Type = type
            };

            Assert.Equal(expected, token.ToString());
        }
    }
}
