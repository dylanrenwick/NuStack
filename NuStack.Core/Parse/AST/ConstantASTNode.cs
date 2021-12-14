namespace NuStack.Core.Parse.AST
{
    public class ConstantASTNode : ExpressionASTNode
    {
        public string Value { get; set; }


        public override void WriteToStringBuilder(StringBuilder builder)
        {
            throw new NotImplementedException();
        }
    }
}
