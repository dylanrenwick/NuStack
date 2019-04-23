import { expect } from "chai";
import { StatementASTNode } from "../../src/AST/StatementASTNode";

// StatementASTNode is abstract, so to test it we need an empty implementation of it
class TestNode extends StatementASTNode { }

describe("StatementASTNode", () => {
    describe("StatementASTNode.childNodes", () => {
        it("should return null", () => {
            let testNode: TestNode = new TestNode();
            expect(testNode.childNodes).to.equal(null);
        });
    });
});
