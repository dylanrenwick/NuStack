using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public class ReturnASTNode : ExpressionASTNode
    {
        public ReturnASTNode(ExpressionASTNode expression)
        {
            children.Add(expression);
        }

        public new static ReturnASTNode ParseNode(TokenStream tokens, NameResolver nameResolver)
        {
            var expression = ExpressionASTNode.ParseNode(tokens, nameResolver);
            return new ReturnASTNode(expression);
        }
    }
}
