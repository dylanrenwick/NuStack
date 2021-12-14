using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public abstract class ExpressionASTNode : ASTNode
    {
        public static ExpressionASTNode ParseNode(TokenStream tokens, NameResolver nameResolver)
        {
            //TODO: Parse expression

            return null;
        }
    }
}
