import { ExpressionASTNode } from "./ExpressionASTNode";

export class ConstantASTNode extends ExpressionASTNode {
    private value: number;

    public get expressionValue(): number { return this.value; }

    public constructor(value: number) {
        super();
        this.value = value;
    }
}
