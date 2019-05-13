import { expect } from "chai";
import { AbstractSyntaxTree } from "../../src/AST/AbstractSyntaxTree";
import { FunctionASTNode } from "../../src/AST/FunctionASTNode";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";

describe("AbstractSyntaxTree:", () => {
    describe("AbstractSyntaxTree.constructor()", () => {
        it("should correctly assign the root node", () => {
            let rootNode = new ProgramASTNode([new FunctionASTNode("main", "int", [])]);

            expect(new AbstractSyntaxTree(rootNode).root).to.equal(rootNode);
        });
    });
});
