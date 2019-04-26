import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";
import { StatementASTNode } from "./StatementASTNode";

export abstract class ExpressionASTNode extends StatementASTNode {
    public abstract get expressionValue(): any;

    public get childNodes(): IASTNode[] | IASTNode { return null; }
    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Unknown Expression");
        return sb;
    }
}
