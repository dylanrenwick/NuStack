namespace NuStack.Core.Parse
{
    public class NameResolver
    {
        private List<FuncFingerprint> fingerprints;

        public NameResolver()
        {
            fingerprints = new List<FuncFingerprint>();
        }

        public bool TryResolve(string name, out FuncFingerprint fingerprint)
        {
            fingerprint = default;

            var matches = fingerprints.Where(x => x.Name == name);
            if (matches.Any())
            {
                fingerprint = matches.First();
                return true;
            }

            return false;
        }

        public FuncFingerprint RegisterFunctionFingerprint(int tokenStart, int tokenEnd, string name)
        {
            var fingerprint = new FuncFingerprint
            {
                TokenStart = tokenStart,
                TokenEnd = tokenEnd,
                Name = name,
                InternalName = genInternalFunctionName(name)
            };
            return fingerprint;
        }

        public void Clear()
        {
            fingerprints.Clear();
        }

        private string genInternalFunctionName(string name)
        {
            return $"__func_{name}";
        }
    }
}
