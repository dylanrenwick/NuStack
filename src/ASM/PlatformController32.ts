import { StringBuilder } from "../StringBuilder";
import { PlatformController, Syscall } from "./PlatformController";

export class PlatformController32 extends PlatformController {
    protected get regPrefix(): string { return "e"; }

    public get wordSize(): number { return 4; }

    public makeSysCall(sb: StringBuilder, sysCall: Syscall, ...data: any[]): StringBuilder {
        switch (sysCall) {
            case Syscall.exit:
                sb.appendLine(`mov ${this.bx}, ${data[0]}`);
                sb.appendLine(`mov ${this.ax}, 1d`);
                break;
            default:
                break;
        }

        sb.appendLine("int 0x80");
        return sb;
    }
}
