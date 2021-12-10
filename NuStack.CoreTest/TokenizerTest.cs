using NuStack.Core.Tokens;

namespace NuStack.CoreTest
{
    public class TokenizerTest
    {
        private Tokenizer tokenizer;

        public TokenizerTest()
        {
            tokenizer = new Tokenizer();
        }

        [Fact]
        public void Tokenize_EmptyProgram_ReturnsEmptyArray()
        {
            string sourceCode = string.Empty;

            IEnumerable<Token> tokens = tokenizer.Tokenize(sourceCode);

            Assert.Empty(tokens);
        }

        public static IEnumerable<object[]> SingleToken_Data => new List<object[]>
        {
            new object[] { "(", Token.Singleton('(', 0) },
            new object[] { ")", Token.Singleton(')', 0) },
            new object[] { "{", Token.Singleton('{', 0) },
            new object[] { "}", Token.Singleton('}', 0) },
            new object[] { "int", new Token
                {
                    Start = 0,
                    End = 3,
                    Value = "int",
                    Type = TokenType.Keyword
                }
            },
            new object[] { "main", new Token
                {
                    Start = 0,
                    End = 4,
                    Value = "main",
                    Type = TokenType.Identifier
                }
            },
            new object[] { "43", new Token
                {
                    Start = 0,
                    End = 2,
                    Value = "43",
                    Type = TokenType.Integer
                }
            },
        };

        [Theory]
        [MemberData(nameof(SingleToken_Data))]
        public void Tokenize_SingleToken_ReturnsToken(string code, Token expected)
        {
            IEnumerable<Token> tokens = tokenizer.Tokenize(code);

            Token token = Assert.Single(tokens);
            Assert.Equal(expected, token);
        }

        [Theory]
        [InlineData("int")]
        [InlineData("return")]
        public void Tokenize_Keyword_ReturnsToken(string keyword)
        {
            var token = new Token
            {
                Start = 0,
                End = keyword.Length,
                Value = keyword,
                Type = TokenType.Keyword
            };

            IEnumerable<Token> tokens = tokenizer.Tokenize(keyword);
            Assert.Equal(token, Assert.Single(tokens));
        }

        [Theory]
        [InlineData("main")]
        [InlineData("PascalCase")]
        [InlineData("camelCase")]
        [InlineData("snake_case")]
        [InlineData("trailing_underscore_")]
        [InlineData("_leading_underscore")]
        [InlineData("__dunder")]
        [InlineData("__dunderboth__")]
        [InlineData("______")]
        [InlineData("SHOUTING")]
        public void Tokenize_Identifier_ReturnsToken(string identifier)
        {
            var token = new Token
            {
                Start = 0,
                End = identifier.Length,
                Value = identifier,
                Type = TokenType.Identifier
            };

            IEnumerable<Token> tokens = tokenizer.Tokenize(identifier);
            Assert.Equal(token, Assert.Single(tokens));
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        [InlineData("37")]
        [InlineData("435987")]
        [InlineData("000358")]
        [InlineData("2147483647")]
        public void Tokenize_Integer_ReturnsToken(string integer)
        {
            var token = new Token
            {
                Start = 0,
                End = integer.Length,
                Value = integer,
                Type = TokenType.Integer
            };

            IEnumerable<Token> tokens = tokenizer.Tokenize(integer);
            Assert.Equal(token, Assert.Single(tokens));
        }

        public static IEnumerable<object[]> FullProgram_Data => new List<object[]>
        {
            new object[] { "int main() { return 0 }",
                new List<Token>
                {
                    new Token(0, TokenType.Keyword, "int"),
                    new Token(4, TokenType.Identifier, "main"),
                    new Token(8, TokenType.OpenParen),
                    new Token(9, TokenType.CloseParen),
                    new Token(11, TokenType.OpenBrace),
                    new Token(13, TokenType.Keyword, "return"),
                    new Token(20, TokenType.Integer, "0"),
                    new Token(22, TokenType.CloseBrace)
                }
            }
        };

        [Theory]
        [MemberData(nameof(FullProgram_Data))]
        public void Tokenize_FullProgram_ReturnsTokens(
            string program,
            List<Token> expected
        )
        {
            Assert.Equal(expected, tokenizer.Tokenize(program));
        }
    }
}