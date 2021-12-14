using NuStack.Core.Parse;
using NuStack.Core.Parse.AST;
using NuStack.Core.Tokens;

namespace NuStack.CoreTest.Parse
{
    public class ParserTest
    {
        private Parser parser;

        public ParserTest()
        {
            parser = new Parser();
        }

        [Fact]
        public void Parse_ReturnsModuleASTNode()
        {
            var stream = new TokenStream(new Token[0]);
            Assert.IsType<ModuleASTNode>(parser.Parse(stream));
        }

        public static IEnumerable<object[]> SingleFunction_Data()
        {
            var stream = new TokenStream(new List<Token>
            {
                new Token(1, 0, 0, TokenType.Keyword, "fn"),
                new Token(1, 3, 3, TokenType.Identifier, "main"),
                new Token(1, 7, 7, TokenType.OpenParen),
                new Token(1, 8, 8, TokenType.CloseParen),
                new Token(1, 17, 17, TokenType.OpenBrace),
                new Token(1, 19, 19, TokenType.Keyword, "return"),
                new Token(1, 26, 26, TokenType.Integer, "0"),
                new Token(1, 27, 27, TokenType.Semicolon),
                new Token(1, 29, 29, TokenType.CloseBrace)
            });
            var rootNode = new ModuleASTNode();
            var mainFuncBody = new ExpressionBlockASTNode();
            var mainFunc = new FuncASTNode(
                new FuncFingerprint
                {
                    TokenStart = 0,
                    TokenEnd = 4,
                    Name = "main",
                    InternalName = "__func_main"
                }, mainFuncBody);
            rootNode.AddFunction(mainFunc);

            return new List<object[]>
            {
                new object[] { stream, rootNode }
            };
        }

        [Theory]
        [MemberData(nameof(SingleFunction_Data))]
        public void Parse_SingleFunction_ParsesFunc(
            TokenStream stream,
            ModuleASTNode expected
        )
        {
            Assert.Equal(expected, parser.Parse(stream));
        }
    }
}
