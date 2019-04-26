import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";

export abstract class StatementASTNode implements IASTNode {
    public get childNodes(): IASTNode[] | IASTNode { return null; }
    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Unknown Statement");
        return sb;
    }
}
