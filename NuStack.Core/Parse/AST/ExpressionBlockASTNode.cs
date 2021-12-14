using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public class ExpressionBlockASTNode : ExpressionASTNode
    {
        public static ExpressionBlockASTNode ParseNode(TokenStream tokens, NameResolver nameResolver)
        {
            tokens.Expect(TokenType.OpenBrace);

            //TODO: Parse expression block

            tokens.Expect(TokenType.CloseBrace);

            return new ExpressionBlockASTNode();
        }
    }
}
