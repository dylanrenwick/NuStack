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
    }
}
