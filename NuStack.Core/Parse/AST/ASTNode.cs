namespace NuStack.Core.Parse.AST
{
    internal abstract class ASTNode
    {
        public abstract IEnumerable<ASTNode> Children { get; }

        public abstract void WriteToStringBuilder(StringBuilder builder);

        public override string ToString()
        {
            var builder = new StringBuilder();
            WriteToStringBuilder(builder);
            return builder.ToString();
        }
    }
}
