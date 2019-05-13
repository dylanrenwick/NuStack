import { StringBuilder } from "../StringBuilder";
import { FunctionASTNode } from "./FunctionASTNode";
import { IASTNode } from "./IASTNode";

export class ProgramASTNode implements IASTNode {
    private mainSub: FunctionASTNode;

    public get childNodes(): FunctionASTNode { return this.mainSub; }

    public constructor(subroutine: FunctionASTNode) {
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
