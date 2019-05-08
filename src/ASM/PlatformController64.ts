import { StringBuilder } from "../StringBuilder";
import { IPlatformController, Syscall } from "./IPlatformController";

export class PlatformController64 implements IPlatformController {
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

    public makeExit(sb: StringBuilder, exitCode: number): StringBuilder {
        return this.makeSysCall(sb, Syscall.exit, exitCode);
    }
}