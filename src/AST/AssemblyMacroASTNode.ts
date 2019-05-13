import { StringBuilder } from "../StringBuilder";
import { CompilerMacroASTNode, MacroType } from "./CompilerMacroASTNode";

export class AssemblyMacroASTNode extends CompilerMacroASTNode {
    private asm: string;

    public get assembly(): string { return this.asm; }

    public constructor(assembly: string) {
        super(MacroType.asm);
        this.asm = assembly;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("ASM");
        for (let line of this.asm.split("\n")) {
            sb.appendLine(line.trim());
        }
        sb.endBlock();

        return sb;
    }
}
