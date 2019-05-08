import { StringBuilder } from "../StringBuilder";
import { IPlatformController, Syscall } from "./IPlatformController";

export class PlatformController64 implements IPlatformController {
    public get primaryAccumulator(): string { return "rax"; }
    public get baseRegister(): string { return "rbx"; }
    public get countRegister(): string { return "rcx"; }
    public get dataRegister(): string { return "rdx"; }

    public get stackPointer(): string { return "rsp"; }
    public get basePointer(): string { return "rbp"; }

    public makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder {
        switch (sysCall) {
            case Syscall.exit:
                sb.appendLine("mov rdi, " + data[0]);
                sb.appendLine("mov rax, 60d");
                break;
            default:
                break;
        }

        sb.appendLine("syscall");
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