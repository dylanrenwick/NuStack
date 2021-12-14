namespace NuStack.Core.Parse.AST
{
    public class ExpressionBlockASTNode : ExpressionASTNode
    {
        public override IEnumerable<ASTNode> Children => children;

        private List<ASTNode> children;

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            foreach (var child in Children) child.WriteToStringBuilder(builder);
        }
    }
}
