namespace NuStack.Core.Parse.AST
{
    public class FuncASTNode : ASTNode
    {
        public FuncFingerprint Fingerprint { get; private set; }

        public FuncASTNode(FuncFingerprint fingerprint, ExpressionASTNode exprNode)
        {
            Fingerprint = fingerprint;
            children.Add(exprNode);
        }

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            builder.AppendLine($"fn {Fingerprint}: {{");
            base.WriteToStringBuilder(builder);
            builder.AppendLine("}");
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj)
                && Fingerprint.Equals(((FuncASTNode)obj).Fingerprint);
        }
    }
}
