import { expect } from "chai";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";
import { ExpressionASTNode } from "../../src/AST/ExpressionASTNode";
import { MonadicASTNode } from "../../src/AST/MonadicASTNode";
import { OperationType } from "../../src/AST/OperationASTNode";

function forOpTypes(callback: (type: OperationType, ...params: any[]) => void, ...params: any[] ) {
    let monadicTypes = [
        OperationType.BitwiseNOT, OperationType.LogicalNOT, OperationType.Negation
    ];

    for (let type of monadicTypes) {
        callback(type, ...params);
    }
}

describe("MonadicASTNode", () => {
    describe("MonadicASTNode.constructor()", () => {
        it("should correctly set operand", () => {
            let node = new MonadicASTNode(0, null);
            expect(node["operand"]).to.equal(null);
            let innerNode = new ConstantASTNode(0);
            node = new MonadicASTNode(0, innerNode);
            expect(node["operand"]).to.equal(innerNode);
        });
    });

    describe("MonadicASTNode.childNodes", () => {
        it("should return an array containing only operand", () => {
            let node = new MonadicASTNode(0, null);
            expect(node.childNodes).to.deep.equal([null]);
            let innerNode = new ConstantASTNode(0);
            node = new MonadicASTNode(0, innerNode);
            expect(node.childNodes).to.deep.equal([ innerNode ]);
        });
    });

    describe("MonadicASTNode.expressionValue", () => {
        it("should correctly apply an operator to a constant value", () => {
            for (let i = 0; i < 10; i++) {
                let expected: number[] = [];
                expected[OperationType.Negation] = -i;
                expected[OperationType.BitwiseNOT] = ~i;
                expected[OperationType.LogicalNOT] = i === 0 ? 0 : 1;

                forOpTypes((type: OperationType, expectVals: number[]) => {
                    expect(new MonadicASTNode(type, new ConstantASTNode(i)).expressionValue).to.equal(expectVals[type]);
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
                    expect(new MonadicASTNode(
                        type, new MonadicASTNode(type, new ConstantASTNode(i))
                    ).expressionValue).to.equal(expectVals[type]);
                }, expected);
            }
        });

        it("should return null with a non-constant, null-expressionValue child", () => {
            class TestNode extends ExpressionASTNode { get expressionValue(): any { return null; } }

            for (let i = 0; i < 10; i++) {
                forOpTypes((type: OperationType) => {
                    expect(new MonadicASTNode(type, new TestNode()).expressionValue).to.equal(null);
                });
            }
        });
    });
});
