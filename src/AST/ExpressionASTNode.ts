import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";
import { StatementASTNode } from "./StatementASTNode";

export abstract class ExpressionASTNode extends StatementASTNode {
    public abstract get expressionValue(): any;
    public abstract get expressionType(): ValueType;

    public get childNodes(): IASTNode[] | IASTNode { return null; }
    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Unknown Expression");
        return sb;
    }

    public static getTypeFromString(type: string): ValueType {
        switch (type) {
            case "int":
            case "integer":
                return ValueType.int;
            case "bool":
            case "boolean":
                return ValueType.bool;
            default: return null;
        }
    }
}

export enum ValueType {
    int,
    bool,
    string,
    char
}
