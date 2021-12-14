using NuStack.Core.Tokens;

namespace NuStack.Core.Parse.AST
{
    public class ConstantASTNode : ExpressionASTNode
    {
        public string Value { get; set; }

        public override void WriteToStringBuilder(StringBuilder builder)
        {
            throw new NotImplementedException();
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj)
                && Value == (obj as ConstantASTNode).Value;
        }

        public new static ConstantASTNode ParseNode(TokenStream tokens, NameResolver nameResolver)
        {
            Token next = tokens.Expect(TokenType.Integer);
            return new ConstantASTNode() { Value = next.Value };
        }
    }
}
