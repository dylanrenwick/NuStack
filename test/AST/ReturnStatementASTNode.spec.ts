import { expect } from "chai";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";
import { ReturnStatementASTNode } from "../../src/AST/ReturnStatementASTNode";

describe("ReturnStatementASTNode", () => {
    describe("ReturnStatementASTNode.constructor()", () => {
        it("should correctly set returnValue", () => {
            let node = new ReturnStatementASTNode(null);
            expect(node["returnValue"]).to.equal(null);
            let innerNode = new ConstantASTNode(0);
            node = new ReturnStatementASTNode(innerNode);
            expect(node["returnValue"]).to.equal(innerNode);
        });
    });

    describe("ReturnStatementASTNode.childNodes", () => {
        it("should return returnValue", () => {
            let node = new ReturnStatementASTNode(null);
            expect(node.childNodes).to.equal(null);
            let innerNode = new ConstantASTNode(0);
            node = new ReturnStatementASTNode(innerNode);
            expect(node.childNodes).to.equal(innerNode);
        });
    });
});
