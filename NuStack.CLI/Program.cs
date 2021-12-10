using NuStack.Core;

namespace NuStack.CLI
{
    class Program
    {
        static void Main(string[] args)
        {
            var compiler = new Compiler();

            string source = "";

            string output = compiler.Compile(source);

            Console.WriteLine(output);
        }
    }
}
