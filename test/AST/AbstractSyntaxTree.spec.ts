import { expect } from "chai";
import { AbstractSyntaxTree } from "../../src/AST/AbstractSyntaxTree";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";

describe("AbstractSyntaxTree:", () => {
    describe("AbstractSyntaxTree.constructor()", () => {
        it("should correctly assign the root node", () => {
            let rootNode = new ProgramASTNode(null);

            expect(new AbstractSyntaxTree(rootNode).root).to.equal(rootNode);
        });
    });
});
