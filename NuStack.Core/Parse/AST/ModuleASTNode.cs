namespace NuStack.Core.Parse.AST
{
    public class ModuleASTNode : ASTNode
    {
        public override IEnumerable<ASTNode> Children => children;

        private List<FuncASTNode> children;

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            foreach(var child in Children) child.WriteToStringBuilder(builder);
        }

        public void AddFunction(FuncASTNode func)
        {
            children.Add(func);
        }
    }
}
