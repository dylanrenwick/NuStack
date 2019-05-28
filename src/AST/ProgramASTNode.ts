import { IFootprint } from "../Parser";
import { StringBuilder } from "../StringBuilder";
import { ValueType } from "./ExpressionASTNode";
import { FunctionASTNode } from "./FunctionASTNode";
import { IASTNode } from "./IASTNode";

export class ProgramASTNode implements IASTNode {
    private funcs: FunctionASTNode[];
    private main: FunctionASTNode;
    private imports: IFootprint[];

    public get childNodes(): FunctionASTNode[] { return this.funcs; }
    public get mainFunc(): FunctionASTNode { return this.main; }
    public get importFuncs(): IFootprint[] { return this.imports; }

    public constructor(functions: FunctionASTNode[], imports: IFootprint[]) {
        this.funcs = functions;
        let entryPoints = this.funcs.filter(
            x => x.name === "main" && x.returnType.type === ValueType.int && !x.returnType.isArray
        );
        if (entryPoints.length > 0) {
            this.main = entryPoints[0];
        }
        this.imports = imports;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.startBlock("Program");
        for (let func of this.funcs) {
            sb = func.toString(sb);
        }
        sb.endBlock();

        return sb;
    }
}
