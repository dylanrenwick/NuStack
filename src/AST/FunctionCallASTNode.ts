import { IFootprint } from "../Parser";
import { StringBuilder } from "../StringBuilder";
import { ExpressionASTNode, ITypeDef } from "./ExpressionASTNode";

export class FunctionCallASTNode extends ExpressionASTNode {
    private footprint: IFootprint;
    private args: ExpressionASTNode[];

    public get expressionValue(): any { return null; }
    public get expressionType(): ITypeDef { return this.footprint.type; }
    public get functionName(): string { return this.footprint.name; }
    public get arguments(): ExpressionASTNode[] { return this.args; }
    public get argDefinitions(): any[] { return this.footprint.args; }

    public constructor(footprint: IFootprint, args: ExpressionASTNode[] = []) {
        super();
        this.footprint = footprint;
        this.args = args;
    }

    public toString(sb: StringBuilder): StringBuilder {
        if (this.args.length > 0) {
            sb.startBlock("Call: " + this.functionName);
            for (let arg of this.args) {
                sb = arg.toString(sb);
            }
            sb.endBlock();
        } else {
            sb.appendLine("Call: " + this.functionName);
        }

        return sb;
    }
}
