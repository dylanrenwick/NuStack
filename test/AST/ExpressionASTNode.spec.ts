import { expect } from "chai";
import { ExpressionASTNode } from "../../src/AST/ExpressionASTNode";

// ExpressionASTNode is abstract, so to test it we need an empty implementation of it
class TestNode extends ExpressionASTNode { get expressionValue(): any { return null; } }

describe("ExpressionASTNode", () => {
    describe("ExpressionASTNode.childNodes", () => {
        it("should return null", () => {
            let testNode: TestNode = new TestNode();
            expect(testNode.childNodes).to.equal(null);
        });
    });
});
