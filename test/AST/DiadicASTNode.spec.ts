import { expect } from "chai";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";
import { DiadicASTNode } from "../../src/AST/DiadicASTNode";
import { ExpressionASTNode, ITypeDef } from "../../src/AST/ExpressionASTNode";
import { OperationASTNode, OperationType } from "../../src/AST/OperationASTNode";

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
            let innerNode = new ConstantASTNode(0, "int");
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
            let innerNode = new ConstantASTNode(0, "int");
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
                expect(new DiadicASTNode(type,
                        new ConstantASTNode(a, "int"),
                        new ConstantASTNode(b, "int"))
                    .expressionValue)
                    .to.equal(OperationASTNode.applyOperator(type, [a, b]));
            });
        });

        it("should correctly apply an operator to a child with an expressionValue", () => {
            forOpTypes((type: OperationType) => {
                let a = Math.floor(Math.random() * 15000);
                let b = Math.floor(Math.random() * 15000);
                let expected = OperationASTNode.applyOperator(type, [OperationASTNode.applyOperator(type, [a, 0]), b]);
                expect(new DiadicASTNode(
                    type, new DiadicASTNode(type, new ConstantASTNode(a, "int"), new ConstantASTNode(0, "int")),
                    new ConstantASTNode(b, "int")
                ).expressionValue).to.equal(expected);
            });
        });

        it("should return null with a non-constant, null-expressionValue child", () => {
            class TestNode extends ExpressionASTNode {
                get expressionValue(): any { return null; }
                get expressionType(): ITypeDef { return null; }
            }

            forOpTypes((type: OperationType) => {
                expect(new DiadicASTNode(
                    type, new TestNode(), new ConstantASTNode(Math.floor(Math.random() * 15000), "int")
                ).expressionValue).to.equal(null);
            });
        });
    });
});
