import { StatementASTNode } from "./StatementASTNode";

export class KeywordASTNode extends StatementASTNode {
    private type: KeywordType;

    public get keywordType(): KeywordType { return this.type; }

    public constructor(type: KeywordType) {
        super();
        this.type = type;
    }
}

export enum KeywordType {
    break,
    continue
}
