using System.Diagnostics.CodeAnalysis;

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
    }
}
