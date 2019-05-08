import { StringBuilder } from "../StringBuilder";
import { PlatformController, Syscall } from "./PlatformController";

export class PlatformController64 extends PlatformController {
    protected get regPrefix(): string { return "r"; }

    public makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder {
        switch (sysCall) {
            case Syscall.exit:
                sb.appendLine(`mov ${this.di}, ${data[0]}`);
                sb.appendLine(`mov ${this.ax}, 60d`);
                break;
            default:
                break;
        }

        sb.appendLine("syscall");
        return sb;
    }
}
