import { expect } from "chai";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";
import { DiadicASTNode } from "../../src/AST/DiadicASTNode";
import { ExpressionASTNode } from "../../src/AST/ExpressionASTNode";
import { applyOperator, OperationType } from "../../src/AST/OperationASTNode";

function forOpTypes(callback: (type: OperationType, ...params: any[]) => void, ...params: any[] ) {
    let monadicTypes = [
        OperationType.BitwiseNOT, OperationType.LogicalNOT, OperationType.Negation
    ];

    for (let type in OperationType) {
        if (!/^[0-9]+$/.test(type)) continue;
        if (monadicTypes.includes(parseInt(type))) continue;
        callback(parseInt(type), ...params);
    }
}

describe("DiadicASTNode", () => {
    describe("DiadicASTNode.constructor()", () => {
        it("should correctly set left and right operand", () => {
            let node = new DiadicASTNode(0, null, null);
            expect(node["leftOperand"]).to.equal(null);
            expect(node["rightOperand"]).to.equal(null);
            let innerNode = new ConstantASTNode(0);
            node = new DiadicASTNode(0, innerNode, null);
            expect(node["leftOperand"]).to.equal(innerNode);
            expect(node["rightOperand"]).to.equal(null);
            node = new DiadicASTNode(0, null, innerNode);
            expect(node["leftOperand"]).to.equal(null);
            expect(node["rightOperand"]).to.equal(innerNode);
        });
    });

    describe("DiadicASTNode.childNodes", () => {
        it("should return an array containing operands", () => {
            let node = new DiadicASTNode(0, null, null);
            expect(node.childNodes).to.deep.equal([null, null]);
            let innerNode = new ConstantASTNode(0);
            node = new DiadicASTNode(0, innerNode, null);
            expect(node.childNodes).to.deep.equal([ innerNode, null]);
            node = new DiadicASTNode(0, null, innerNode);
            expect(node.childNodes).to.deep.equal([ null, innerNode]);
        });
    });

    describe("DiadicASTNode.expressionValue", () => {
        it("should correctly apply an operator to a constant value", () => {
            forOpTypes((type: OperationType) => {
                let a = Math.floor(Math.random() * 15000);
                let b = Math.floor(Math.random() * 15000);
                expect(new DiadicASTNode(type, new ConstantASTNode(a), new ConstantASTNode(b)).expressionValue)
                    .to.equal(applyOperator(type, [a, b]));
            });
        });

        it("should correctly apply an operator to a child with an expressionValue", () => {
            forOpTypes((type: OperationType) => {
                let a = Math.floor(Math.random() * 15000);
                let b = Math.floor(Math.random() * 15000);
                let expected = applyOperator(type, [applyOperator(type, [a, 0]), b]);
                expect(new DiadicASTNode(
                    type, new DiadicASTNode(type, new ConstantASTNode(a), new ConstantASTNode(0)),
                    new ConstantASTNode(b)
                ).expressionValue).to.equal(expected);
            });
        });

        it("should return null with a non-constant, null-expressionValue child", () => {
            class TestNode extends ExpressionASTNode { get expressionValue(): any { return null; } }

            forOpTypes((type: OperationType) => {
                expect(new DiadicASTNode(
                    type, new TestNode(), new ConstantASTNode(Math.floor(Math.random() * 15000))
                ).expressionValue).to.equal(null);
            });
        });
    });
});
