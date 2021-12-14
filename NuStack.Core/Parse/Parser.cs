using NuStack.Core.Tokens;
using NuStack.Core.Parse.AST;

namespace NuStack.Core.Parse
{
    public class Parser
    {
        private TokenStream tokenStream;
        private NameResolver nameResolver;

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

            while (!tokenStream.IsAtEnd)
            {
                FuncASTNode nextFunc = parseFunc();
                rootNode.AddFunction(nextFunc);
            }

            return rootNode;
        }

        private void findFuncDefinitions()
        {
            tokenStream.EachToken(TokenType.Keyword, "fn");
            while (tokenStream.MoveNext())
            {
                parseFuncFingerprint();
            }
            tokenStream.Reset();
        }

        private FuncASTNode parseFunc()
        {
            tokenStream.Expect(TokenType.Keyword, "fn");
            FuncFingerprint fingerprint = parseFuncFingerprint();
            ExpressionASTNode body;
            if (tokenStream.Peek().Type == TokenType.OpenBrace)
                body = parseExpressionBlock();
            else body = parseExpression();

            return new FuncASTNode(fingerprint, body);
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
