import { expect } from "chai";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";

describe("ConstantASTNode", () => {
    describe("ConstantASTNode.constructor()", () => {
        it("should correctly assign value", () => {
            expect(new ConstantASTNode(0, "int")["value"]).to.equal(0);
            let rand = Math.random();
            expect(new ConstantASTNode(rand, "int")["value"]).to.equal(rand);
            expect(new ConstantASTNode(95783, "int")["value"]).to.equal(95783);
            expect(new ConstantASTNode(-2598, "int")["value"]).to.equal(-2598);
            expect(new ConstantASTNode(0.03, "int")["value"]).to.equal(0.03);
        });
    });

    describe("ConstantASTNode.expressionValue", () => {
        it("should return value", () => {
            expect(new ConstantASTNode(0, "int").expressionValue).to.equal(0);
            let rand = Math.random();
            expect(new ConstantASTNode(rand, "int").expressionValue).to.equal(rand);
            expect(new ConstantASTNode(95783, "int").expressionValue).to.equal(95783);
            expect(new ConstantASTNode(-2598, "int").expressionValue).to.equal(-2598);
            expect(new ConstantASTNode(0.03, "int").expressionValue).to.equal(0.03);
        });
    });
});
