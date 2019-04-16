import { IASTNode } from "./IASTNode";

export abstract class ExpressionASTNode implements IASTNode {
    public abstract get expressionValue(): any;

    public get childNodes(): IASTNode[] | IASTNode { return null; }
}
