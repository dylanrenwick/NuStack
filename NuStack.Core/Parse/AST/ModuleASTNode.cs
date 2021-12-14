using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public class ModuleASTNode : ASTNode
    {
        public void AddNode(ASTNode func)
        {
            children.Add(func);
        }

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            builder.AppendLine("module: {");
            base.WriteToStringBuilder(builder);
            builder.AppendLine("}");
        }

        public new static ModuleASTNode ParseNode(TokenStream tokens, NameResolver nameResolver)
        {
            var node = new ModuleASTNode();
            while (!tokens.IsAtEnd)
            {
                ASTNode next = ASTNode.ParseNode(tokens, nameResolver);
                node.AddNode(next);
            }
            return node;
        }
    }
}
