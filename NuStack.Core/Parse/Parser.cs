using NuStack.Core.Tokens;
using NuStack.Core.Parse.AST;

namespace NuStack.Core.Parse
{
    public class Parser
    {
        private TokenStream tokenStream;

        public ASTNode Parse(TokenStream tokens)
        {
            tokenStream = tokens;
            return null;
        }
    }
}
