import { ExpressionASTNode, ITypeDef, ValueType } from "./ExpressionASTNode";

export class RegASTNode extends ExpressionASTNode {
    private regName: string;

    public get registerName(): string { return this.regName; }
    public get expressionValue(): any { return null; }
    public get expressionType(): ITypeDef { return { type: ValueType.int, isArray: false, isPtr: false }; }

    public constructor(regName: string) {
        super();
        this.regName = regName;
    }
}
