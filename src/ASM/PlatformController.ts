import { StringBuilder } from "../StringBuilder";

export abstract class PlatformController {
    public get ax(): string { return this.regPrefix + "ax"; }
    public get bx(): string { return this.regPrefix + "bx"; }
    public get cx(): string { return this.regPrefix + "cx"; }
    public get dx(): string { return this.regPrefix + "dx"; }

    public get sp(): string { return this.regPrefix + "sp"; }
    public get bp(): string { return this.regPrefix + "bp"; }

    public get si(): string { return this.regPrefix + "si"; }
    public get di(): string { return this.regPrefix + "di"; }

    public abstract get wordSize(): number;

    protected abstract get regPrefix(): string;

    public abstract makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder;

    public makeExit(sb: StringBuilder, exitCode: number|string): StringBuilder {
        return this.makeSysCall(sb, Syscall.exit, exitCode);
    }

    public getRegisterName(reg: string): string {
        switch (reg) {
            case "ax": return this.ax;
            case "bx": return this.bx;
            case "cx": return this.cx;
            case "dx": return this.dx;
            case "sp": return this.sp;
            case "bp": return this.bp;
            case "si": return this.si;
            case "di": return this.di;
            default: return reg;
        }
    }

    public makeStackFrame(sb: StringBuilder): StringBuilder {
        sb.appendLine("push " + this.bp);
        sb.appendLine(`mov ${this.bp}, ${this.sp}`);
        return sb;
    }

    public endStackFrame(sb: StringBuilder): StringBuilder {
        sb.appendLine(`mov ${this.sp}, ${this.bp}`);
        sb.appendLine("pop " + this.bp);
        return sb;
    }
}

export enum Syscall {
    read,
    write,
    open,
    close,
    stat,
    fstat,
    lstat,
    poll,
    lseek,
    mmap,
    mprotect,
    munmap,
    exit
}
