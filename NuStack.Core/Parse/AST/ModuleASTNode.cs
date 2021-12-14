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
    }
}
