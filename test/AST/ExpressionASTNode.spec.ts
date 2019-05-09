import { expect } from "chai";
import { ExpressionASTNode, ValueType } from "../../src/AST/ExpressionASTNode";

// ExpressionASTNode is abstract, so to test it we need an empty implementation of it
class TestNode extends ExpressionASTNode {
    get expressionValue(): any { return null; }
    get expressionType(): ValueType { return null; }
}

describe("ExpressionASTNode", () => {
    describe("ExpressionASTNode.childNodes", () => {
        it("should return null", () => {
            let testNode: TestNode = new TestNode();
            expect(testNode.childNodes).to.equal(null);
        });
    });

    describe("ExpressionASTNode.getTypeFromString()", () => {
        it("should return int when given int aliases", () => {
            expect(ExpressionASTNode.getTypeFromString("int")).to.equal(ValueType.int);
            expect(ExpressionASTNode.getTypeFromString("integer")).to.equal(ValueType.int);
        });

        it("should return bool when given bool aliases", () => {
            expect(ExpressionASTNode.getTypeFromString("bool")).to.equal(ValueType.bool);
            expect(ExpressionASTNode.getTypeFromString("boolean")).to.equal(ValueType.bool);
        });

        it("should return null when given invalid types", () => {
            expect(ExpressionASTNode.getTypeFromString("notarealtype")).to.be.null;
            expect(ExpressionASTNode.getTypeFromString("")).to.be.null;
            expect(ExpressionASTNode.getTypeFromString("inte")).to.be.null;
            expect(ExpressionASTNode.getTypeFromString("bolean")).to.be.null;
        });
    });
});
