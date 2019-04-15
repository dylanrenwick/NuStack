import { ExpressionASTNode } from "./ExpressionASTNode";
import { IASTNode } from "./IASTNode";

export abstract class StatementASTNode implements IASTNode {
    public get childNodes(): ExpressionASTNode { return null; }
}