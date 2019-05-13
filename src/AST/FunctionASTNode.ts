import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ValueType } from "./ExpressionASTNode";
import { IASTNode } from "./IASTNode";
import { StatementASTNode } from "./StatementASTNode";

export class FunctionASTNode implements IASTNode {
    private funcName: string;
    private return: ValueType;
    private children: StatementASTNode[];
    private args: Declaration[];

    public get childNodes(): StatementASTNode[] { return this.children; }
    public get name(): string { return this.funcName; }
    public get returnType(): ValueType { return this.return; }
    public get arguments(): Declaration[] { return this.args; }

    public constructor(name: string, returnType: string, children: StatementASTNode[], args: Declaration[] = []) {
        this.funcName = name;
        this.return = ExpressionASTNode.getTypeFromString(returnType);
        this.children = children;
        this.args = args;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("Func '" + this.funcName + "' [" + this.return + "]");

        for (let statement of this.children) {
            sb = statement.toString(sb);
        }

        sb.endBlock();
        return sb;
    }
}
