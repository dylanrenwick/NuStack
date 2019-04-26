import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";
import { SubroutineASTNode } from "./SubroutineASTNode";

export class ProgramASTNode implements IASTNode {
    private mainSub: SubroutineASTNode;

    public get childNodes(): SubroutineASTNode { return this.mainSub; }

    public constructor(subroutine: SubroutineASTNode) {
        this.mainSub = subroutine;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("Program");
        sb.startBlock("Main Sub");
        sb = this.mainSub.toString(sb);
        sb.endBlock();
        sb.endBlock();

        return sb;
    }
}
