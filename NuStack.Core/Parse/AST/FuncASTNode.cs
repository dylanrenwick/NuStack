namespace NuStack.Core.Parse.AST
{
    public class FuncASTNode : ASTNode
    {
        public FuncFingerprint Fingerprint { get; private set; }

        public override IEnumerable<ASTNode> Children => new ASTNode[] { expression };

        private ExpressionASTNode expression;

        public FuncASTNode(FuncFingerprint fingerprint, ExpressionASTNode exprNode)
        {
            Fingerprint = fingerprint;
            expression = exprNode;
        }

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            foreach (var child in Children) child.WriteToStringBuilder(builder);
        }
    }
}
