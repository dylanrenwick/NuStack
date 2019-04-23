import { Declaration } from "../Declaration";
import { StatementASTNode } from "./StatementASTNode";

export class DeclarationASTNode extends StatementASTNode {
    private dec: Declaration;

    public get declaration(): Declaration { return this.dec; }

    public constructor(dec: Declaration) {
        super();
        this.dec = dec;
    }
}
