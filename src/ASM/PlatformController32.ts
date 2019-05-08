import { StringBuilder } from "../StringBuilder";
import { IPlatformController, Syscall } from "./IPlatformController";

export class PlatformController32 implements IPlatformController {
    public get primaryAccumulator(): string { return "eax"; }
    public get baseRegister(): string { return "ebx"; }
    public get countRegister(): string { return "ecx"; }
    public get dataRegister(): string { return "edx"; }

    public get stackPointer(): string { return "esp"; }
    public get basePointer(): string { return "ebp"; }

    public makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder {
        switch (sysCall) {
            case Syscall.exit:
                sb.appendLine("mov ebx, " + data[0]);
                sb.appendLine("mov eax, 1d");
                break;
            default:
                break;
        }

        sb.appendLine("int 0x80");
        return sb;
    }

    public makeExit(sb: StringBuilder, exitCode: number|string): StringBuilder {
        return this.makeSysCall(sb, Syscall.exit, exitCode);
    }

    public makeStackFrame(sb: StringBuilder): StringBuilder {
        sb.appendLine("push " + this.basePointer);
        sb.appendLine(`mov ${this.basePointer}, ${this.stackPointer}`);
        return sb;
    }

    public endStackFrame(sb: StringBuilder): StringBuilder {
        sb.appendLine(`mov ${this.stackPointer}, ${this.basePointer}`);
        sb.appendLine("pop " + this.basePointer);
        return sb;
    }
}