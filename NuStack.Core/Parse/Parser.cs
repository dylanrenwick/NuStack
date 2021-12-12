﻿using NuStack.Core.Tokens;
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
    }
}
