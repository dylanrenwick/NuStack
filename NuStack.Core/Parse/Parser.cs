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

        private IEnumerable<int> findFuncDefinitions()
        {
            var result = new List<int>();
            tokenStream.EachToken(TokenType.Keyword, "fn");
            while (tokenStream.MoveNext())
            {
                int fnStart = tokenStream.CurrentIndex;
                Token ident = tokenStream.Expect(TokenType.Identifier);
                string funcName = ident.Value;
                tokenStream.Expect(TokenType.OpenParen);
                tokenStream.Expect(TokenType.CloseParen);
                result.Add(fnStart);
            }

            return result;
        }
    }
}
