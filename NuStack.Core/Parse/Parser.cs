using NuStack.Core.Tokens;
using NuStack.Core.Parse.AST;

namespace NuStack.Core.Parse
{
    public class Parser
    {
        private TokenStream tokenStream;
        private NameResolver nameResolver;

        public Parser()
        {
            nameResolver = new NameResolver();
        }

        public ASTNode Parse(TokenStream tokens)
        {
            tokenStream = tokens;
            nameResolver.Clear();

            findFuncDefinitions();

            return ModuleASTNode.ParseNode(tokenStream, nameResolver);
        }

        private void findFuncDefinitions()
        {
            tokenStream.EachToken(TokenType.Keyword, "fn");
            while (tokenStream.MoveNext())
            {
                FuncFingerprint.ParseFingerprint(tokenStream, nameResolver);
            }
            tokenStream.Reset();
        }
    }
}
