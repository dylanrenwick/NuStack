import { StringBuilder } from "../StringBuilder";
import { IASTNode } from "./IASTNode";
import { StatementASTNode } from "./StatementASTNode";

export interface ITypeDef {
    type: ValueType;
    isArray: boolean;
    isPtr: boolean;
}

export abstract class ExpressionASTNode extends StatementASTNode {
    public abstract get expressionValue(): any;
    public abstract get expressionType(): ITypeDef;

    public get childNodes(): IASTNode[] | IASTNode { return null; }
    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Unknown Expression");
        return sb;
    }

    public isCompatibleWithType(type: ITypeDef): boolean {
        if (this.expressionType === null) return true;
        if (type.isPtr !== this.expressionType.isPtr) return false;
        if (type.type === ValueType.any || this.expressionType.type === ValueType.any) return true;

        return type.type === this.expressionType.type
            && type.isArray === this.expressionType.isArray;
    }

    public static getTypeFromString(type: string): ITypeDef {
        switch (type) {
            case "int":
            case "integer":
                return {
                    isArray: false,
                    isPtr: false,
                    type: ValueType.int
                };
            case "bool":
            case "boolean":
                return {
                    isArray: false,
                    isPtr: false,
                    type: ValueType.bool
                };
            case "char":
                return {
                    isArray: false,
                    isPtr: false,
                    type: ValueType.char
                };
            case "string":
                return {
                    isArray: true,
                    isPtr: false,
                    type: ValueType.char
                };
            default: return null;
        }
    }
}

export enum ValueType {
    any,
    int,
    bool,
    char
}
