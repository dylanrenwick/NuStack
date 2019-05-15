import { expect } from "chai";
import { ExpressionASTNode, ITypeDef, ValueType } from "../../src/AST/ExpressionASTNode";

// ExpressionASTNode is abstract, so to test it we need an empty implementation of it
class TestNode extends ExpressionASTNode {
    get expressionValue(): any { return null; }
    get expressionType(): ITypeDef { return null; }
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
            expect(ExpressionASTNode.getTypeFromString("int").type).to.equal(ValueType.int);
            expect(ExpressionASTNode.getTypeFromString("integer").type).to.equal(ValueType.int);
        });

        it("should return bool when given bool aliases", () => {
            expect(ExpressionASTNode.getTypeFromString("bool").type).to.equal(ValueType.bool);
            expect(ExpressionASTNode.getTypeFromString("boolean").type).to.equal(ValueType.bool);
        });

        it("should return null when given invalid types", () => {
            expect(ExpressionASTNode.getTypeFromString("notarealtype")).to.be.null;
            expect(ExpressionASTNode.getTypeFromString("")).to.be.null;
            expect(ExpressionASTNode.getTypeFromString("inte")).to.be.null;
            expect(ExpressionASTNode.getTypeFromString("bolean")).to.be.null;
        });
    });
});
