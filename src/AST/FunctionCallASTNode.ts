import { IFootprint } from "../Parser";
import { ExpressionASTNode, ValueType } from "./ExpressionASTNode";

export class FunctionCallASTNode extends ExpressionASTNode {
    private footprint: IFootprint;
    private args: ExpressionASTNode[];

    public get expressionValue(): any { return null; }
    public get expressionType(): ValueType { return this.footprint.type; }

    public constructor(footprint: IFootprint, args: ExpressionASTNode[] = []) {
        super();
        this.footprint = footprint;
        this.args = args;
    }
}
