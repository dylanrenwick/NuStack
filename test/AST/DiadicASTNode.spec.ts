import { expect } from "chai";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";
import { DiadicASTNode } from "../../src/AST/DiadicASTNode";
import { ExpressionASTNode } from "../../src/AST/ExpressionASTNode";
import { OperationType } from "../../src/AST/OperationASTNode";

function forOpTypes(callback: (type: OperationType, ...params: any[]) => void, ...params: any[] ) {
    let monadicTypes = [
        OperationType.BitwiseNOT, OperationType.LogicalNOT, OperationType.Negation
    ];

    for (let type of monadicTypes) {
        callback(type, ...params);
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
            expect(node.childNodes).to.equal([null, null]);
            let innerNode = new ConstantASTNode(0);
            node = new DiadicASTNode(0, innerNode, null);
            expect(node.childNodes).to.equal([ innerNode, null]);
            node = new DiadicASTNode(0, null, innerNode);
            expect(node.childNodes).to.equal([ null, innerNode]);
        });
    });

    describe("DiadicASTNode.expressionValue", () => {
        it("should correctly apply an operator to a constant value", () => {
            for (let i = 0; i < 10; i++) {
                let expected: number[] = [];
                expected[OperationType.Negation] = -i;
                expected[OperationType.BitwiseNOT] = ~i;
                expected[OperationType.LogicalNOT] = i === 0 ? 0 : 1;

                forOpTypes((type: OperationType, expectVals: number[]) => {
                    expect(new DiadicASTNode(type, new ConstantASTNode(i)).expressionValue).to.equal(expectVals[type]);
                }, expected);
            }
        });

        it("should correctly apply an operator to a child with an expressionValue", () => {
            for (let i = 0; i < 10; i++) {
                let expected: number[] = [];
                expected[OperationType.Negation] = -(-i);
                expected[OperationType.BitwiseNOT] = ~(~i);
                expected[OperationType.LogicalNOT] = (i === 0 ? 0 : 1) === 0 ? 0 : 1;

                forOpTypes((type: OperationType, expectVals: number[]) => {
                    expect(new DiadicASTNode(
                        type, new DiadicASTNode(type, new ConstantASTNode(i))
                    ).expressionValue).to.equal(expectVals[type]);
                }, expected);
            }
        });

        it("should return null with a non-constant, null-expressionValue child", () => {
            class TestNode extends ExpressionASTNode { get expressionValue(): any { return null; } }

            for (let i = 0; i < 10; i++) {
                forOpTypes((type: OperationType) => {
                    expect(new DiadicASTNode(type, new TestNode()).expressionValue).to.equal(null);
                });
            }
        });
    });
});
