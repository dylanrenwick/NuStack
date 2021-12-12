namespace NuStack.Core.Parse
{
    public struct FuncFingerprint
    {
        public int TokenStart { get; set; }
        public int TokenEnd { get; set; }
        public string Name { get; set; }
        public string InternalName { get; set; }
    }
}
