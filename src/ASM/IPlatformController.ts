import { StringBuilder } from "../StringBuilder";

export interface IPlatformController {
    primaryAccumulator: string;
    baseRegister: string;
    countRegister: string;
    dataRegister: string;

    stackPointer: string;
    basePointer: string;

    makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder;
    makeExit(sb: StringBuilder, exitCode: number|string): StringBuilder;

    makeStackFrame(sb: StringBuilder): StringBuilder;
    endStackFrame(sb: StringBuilder): StringBuilder;
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