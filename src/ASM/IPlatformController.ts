import { StringBuilder } from "../StringBuilder";

export interface IPlatformController {
    makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder;
    makeExit(sb: StringBuilder, exitCode: number): StringBuilder;
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