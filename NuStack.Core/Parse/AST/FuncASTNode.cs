namespace NuStack.Core.Parse.AST
{
    public class FuncASTNode : ASTNode
    {
        public FuncFingerprint Fingerprint { get; private set; }

        public override IEnumerable<ASTNode> Children => children;

        private List<ASTNode> children;

        public FuncASTNode(FuncFingerprint fingerprint, IEnumerable<ASTNode> nodes)
        {
            Fingerprint = fingerprint;
            children = nodes.ToList();
        }

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            foreach (var child in Children) child.WriteToStringBuilder(builder);
        }
    }
}
