using System.Diagnostics.CodeAnalysis;
using NuStack.Core.Tokens;

namespace NuStack.Core.Parse
{
    public struct FuncFingerprint
    {
        public int TokenStart { get; set; }
        public int TokenEnd { get; set; }
        public string Name { get; set; }
        public string InternalName { get; set; }

        public override bool Equals([NotNullWhen(true)] object obj)
        {
            return this.GetType() == obj.GetType()
                && Name == ((FuncFingerprint)obj).Name
                && InternalName == ((FuncFingerprint)obj).InternalName;
        }

        public override string ToString()
        {
            return $"{Name}:{InternalName}()";
        }

        public static FuncFingerprint ParseFingerprint(TokenStream tokens, NameResolver nameResolver)
        {
            int fnStart = tokens.CurrentIndex;
            Token ident = tokens.Expect(TokenType.Identifier);
            string funcName = ident.Value;

            if (nameResolver.TryResolve(funcName, out FuncFingerprint fingerprint))
            {
                if (fingerprint.TokenStart == fnStart) return fingerprint;
                else throw new Exception("Duplicate functions: " + funcName);
            }

            tokens.Expect(TokenType.OpenParen);
            tokens.Expect(TokenType.CloseParen);

            return nameResolver.RegisterFunctionFingerprint(fnStart, fnStart + 3, funcName);
        }
    }
}
