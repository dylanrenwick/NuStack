using NuStack.Core.Tokens;

namespace NuStack.Core
{
    public class Compiler
    {
        public string Compile(string sourceCode)
        {
            var tokenizer = new Tokenizer();

            IEnumerable<Token> tokens = tokenizer.Tokenize(sourceCode);

            return string.Join(' ', tokens.Select(token => token.ToString()));
        }
    }
}
