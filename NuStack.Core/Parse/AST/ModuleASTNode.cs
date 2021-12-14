using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public class ModuleASTNode : ASTNode
    {
        public void AddFunction(FuncASTNode func)
        {
            children.Add(func);
        }

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            builder.AppendLine("module: {");
            base.WriteToStringBuilder(builder);
            builder.AppendLine("}");
        }

        public static ModuleASTNode ParseNode(TokenStream tokens, NameResolver nameResolver)
        {
            var node = new ModuleASTNode();
            while (!tokens.IsAtEnd)
            {
                FuncASTNode nextFunc = FuncASTNode.ParseNode(tokens, nameResolver);
                node.AddFunction(nextFunc);
            }
            return node;
        }
    }
}
