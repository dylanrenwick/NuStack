import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";

export abstract class CompilerMacroASTNode implements IASTNode {
    protected macroType: MacroType;

    public get childNodes(): IASTNode | IASTNode[] { return null; }

    public constructor(macroType: MacroType) {
        this.macroType = macroType;
    }

    public abstract toString(sb: StringBuilder): StringBuilder;

    public static macroFromString(str: string): MacroType {
        switch (str.toLowerCase()) {
            case "asm":
            case "nasm":
            case "assembly":
                return MacroType.asm;
            default:
                return null;
        }
    }
}

export enum MacroType {
    asm
}
