import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";

export abstract class ExpressionASTNode implements IASTNode {
    public abstract get expressionValue(): any;

    public get childNodes(): IASTNode[] | IASTNode { return null; }
    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Unknown Expression");
        return sb;
    }
}
