import { StringBuilder } from "../StringBuilder";
import { IPlatformController, Syscall } from "./IPlatformController";

export class PlatformController32 implements IPlatformController {
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

    public makeExit(sb: StringBuilder, exitCode: number): StringBuilder {
        return this.makeSysCall(sb, Syscall.exit, exitCode);
    }
}