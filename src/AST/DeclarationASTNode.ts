import { Declaration } from "../Declaration";
import { StringBuilder } from "../StringBuilder";
import { StatementASTNode } from "./StatementASTNode";

export class DeclarationASTNode extends StatementASTNode {
    private dec: Declaration;

    public get declaration(): Declaration { return this.dec; }

    public constructor(dec: Declaration) {
        super();
        this.dec = dec;
    }

    public toString(sb: StringBuilder): StringBuilder {
        sb.appendLine("Declare: '" + this.dec.variableName + "' [" + this.dec.variableType + "]");
        return sb;
    }
}
