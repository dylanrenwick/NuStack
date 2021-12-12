using NuStack.Core.Tokens;
using NuStack.Core.Parse.AST;

namespace NuStack.Core.Parse
{
    public class Parser
    {
        private TokenStream tokenStream;
        private NameResolver nameResolver;

        private FuncFingerprint entryPoint;

        public Parser()
        {
            nameResolver = new NameResolver();
        }

        public ASTNode Parse(TokenStream tokens)
        {
            tokenStream = tokens;
            nameResolver.Clear();

            findFuncDefinitions();
            if (!nameResolver.TryResolve("main", out entryPoint))
                throw new ParserException("Could not find entry point method with name 'main'");

            var rootNode = new ModuleASTNode();

            parseFuncBody(entryPoint);

            return null;
        }

        private void findFuncDefinitions()
        {
            tokenStream.EachToken(TokenType.Keyword, "fn");
            while (tokenStream.MoveNext())
            {
                parseFuncFingerprint();
            }
        }

        private FuncFingerprint parseFuncFingerprint()
        {
            int fnStart = tokenStream.CurrentIndex;
            Token ident = tokenStream.Expect(TokenType.Identifier);
            string funcName = ident.Value;

            tokenStream.Expect(TokenType.OpenParen);
            tokenStream.Expect(TokenType.CloseParen);

            return nameResolver.RegisterFunctionFingerprint(fnStart, fnStart + 3, funcName);
        }

        private void parseFuncBody(FuncFingerprint fingerprint)
        {
            tokenStream.Seek(fingerprint.TokenEnd);
            if (tokenStream.Current.Type == TokenType.OpenBrace) parseExpressionBlock();
            else parseExpression();
        }

        private void parseExpressionBlock()
        {
            tokenStream.Expect(TokenType.OpenBrace);

            //TODO: Parse expression block

            tokenStream.Expect(TokenType.CloseBrace);
        }

        private void parseExpression()
        {
            //TODO: Parse expression
        }
    }
}
