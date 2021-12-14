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

            var rootNode = new ModuleASTNode();

            return rootNode;
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

        private FuncASTNode parseFuncBody(FuncFingerprint fingerprint)
        {
            tokenStream.Seek(fingerprint.TokenEnd);
            ExpressionASTNode body;
            if (tokenStream.Current.Type == TokenType.OpenBrace)
                body = parseExpressionBlock();
            else body = parseExpression();

            return new FuncASTNode(fingerprint, body);
        }

        private ExpressionBlockASTNode parseExpressionBlock()
        {
            tokenStream.Expect(TokenType.OpenBrace);

            //TODO: Parse expression block

            tokenStream.Expect(TokenType.CloseBrace);

            return new ExpressionBlockASTNode();
        }

        private ExpressionASTNode parseExpression()
        {
            //TODO: Parse expression

            return null;
        }
    }
}
