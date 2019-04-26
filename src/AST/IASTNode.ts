import { StringBuilder } from "../StringBuilder";

export interface IASTNode {
    childNodes: IASTNode[] | IASTNode;
    toString(sb: StringBuilder): StringBuilder;
}
