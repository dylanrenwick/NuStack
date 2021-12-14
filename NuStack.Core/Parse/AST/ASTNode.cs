using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public abstract class ASTNode
    {
        public virtual IEnumerable<ASTNode> Children { get => children; }

        protected List<ASTNode> children = new List<ASTNode>();

        public virtual void WriteToStringBuilder(StringBuilder builder)
        {
            foreach (var child in Children) child.WriteToStringBuilder(builder);
        }

        public override string ToString()
        {
            var builder = new StringBuilder();
            WriteToStringBuilder(builder);
            return builder.ToString();
        }

        public override bool Equals(object obj)
        {
            return this.GetType() == obj.GetType()
                && Children.Equals(((ASTNode)obj).Children);
        }
    }
}
