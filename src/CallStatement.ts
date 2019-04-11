import { Subroutine } from "./Subroutine";

export class CallStatement {
    private loc: number;
    private statement: string[];
    private curSubs: Subroutine;
}
