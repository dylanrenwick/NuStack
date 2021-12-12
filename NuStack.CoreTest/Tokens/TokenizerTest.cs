using NuStack.Core.Tokens;

namespace NuStack.CoreTest.Tokens
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
            new object[] { "(", new Token(1, 0, 0, TokenType.OpenParen) },
            new object[] { ";", new Token(1, 0, 0, TokenType.Semicolon) },
            new object[] { "->", new Token(1, 0, 0, TokenType.ReturnArrow) },
            new object[] { "int", new Token(1, 0, 0, TokenType.Keyword, "int") },
            new object[] { "main", new Token(1, 0, 0, TokenType.Identifier, "main") },
            new object[] { "43", new Token(1, 0, 0, TokenType.Integer, "43") },
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
        [InlineData("fn")]
        [InlineData("int")]
        [InlineData("return")]
        public void Tokenize_Keyword_ReturnsToken(string keyword)
        {
            var token = new Token
            {
                Line = 1,
                Column = 0,
                Start = 0,
                End = keyword.Length,
                Type = TokenType.Keyword,
                Value = keyword,
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
                Line = 1,
                Column = 0,
                Start = 0,
                End = identifier.Length,
                Type = TokenType.Identifier,
                Value = identifier,
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
            var token = new Token(1, 0, 0, TokenType.Integer, integer);

            IEnumerable<Token> tokens = tokenizer.Tokenize(integer);
            Assert.Equal(token, Assert.Single(tokens));
        }

        [Theory]
        [InlineData("(", TokenType.OpenParen)]
        [InlineData(")", TokenType.CloseParen)]
        [InlineData("{", TokenType.OpenBrace)]
        [InlineData("}", TokenType.CloseBrace)]
        [InlineData(";", TokenType.Semicolon)]
        [InlineData("\n", TokenType.NewLine)]
        [InlineData("->", TokenType.ReturnArrow)]
        public void Tokenize_StaticToken_ReturnsToken(
            string staticToken,
            TokenType type
        )
        {
            var token = new Token(1, 0, 0, type);

            IEnumerable<Token> tokens = tokenizer.Tokenize(staticToken);
            Assert.Equal(token, Assert.Single(tokens));
        }

        [Theory]
        [InlineData("--")]
        public void Tokenize_InvalidStaticToken_Throws(string staticToken)
        {
            Assert.Throws<InvalidTokenException>(() => tokenizer.Tokenize(staticToken));
        }

        [Theory]
        [InlineData("@")]
        [InlineData("$")]
        [InlineData("#")]
        [InlineData("`")]
        public void Tokenize_InvalidChars_Throws(string code)
        {
            Assert.Throws<InvalidTokenException>(() => tokenizer.Tokenize(code));
        }

        public static IEnumerable<object[]> FullProgram_Data => new List<object[]>
        {
            new object[] { "fn int main() { return 0; }",
                new List<Token>
                {
                    new Token(1, 0, 0, TokenType.Keyword, "fn"),
                    new Token(1, 3, 3, TokenType.Keyword, "int"),
                    new Token(1, 7, 7, TokenType.Identifier, "main"),
                    new Token(1, 11, 11, TokenType.OpenParen),
                    new Token(1, 12, 12, TokenType.CloseParen),
                    new Token(1, 14, 14, TokenType.OpenBrace),
                    new Token(1, 16, 16, TokenType.Keyword, "return"),
                    new Token(1, 23, 23, TokenType.Integer, "0"),
                    new Token(1, 24, 24, TokenType.Semicolon),
                    new Token(1, 26, 26, TokenType.CloseBrace)
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