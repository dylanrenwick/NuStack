import { IASTNode } from "./IASTNode";
import { SubroutineASTNode } from "./SubroutineASTNode";

export class ProgramASTNode implements IASTNode {
    private mainSub: SubroutineASTNode;

    public get childNodes(): SubroutineASTNode { return this.mainSub; }

    public constructor(subroutine: SubroutineASTNode) {
        this.mainSub = subroutine;
    }
}