import { expect } from "chai";
import { ExpressionASTNode } from "../../src/AST/ExpressionASTNode";
import { OperationASTNode, OperationType } from "../../src/AST/OperationASTNode";

class TestNode extends OperationASTNode {
    get childNodes(): ExpressionASTNode[] { return null; }
    get expressionValue(): any { return null; }
}

function forOpTypes(callback: (type: OperationType) => void) {
    for (let type in OperationType) {
        if (!/^[0-9]+$/.test(type)) continue;

        callback(parseInt(type));
    }
}

describe("OperationASTNode", () => {
    describe("OperationASTNode.constructor()", () => {
        it("should correctly set opType", () => {
            forOpTypes((type: OperationType) => {
                expect(new TestNode(type)["opType"]).to.equal(type);
            });
        });
    });

    describe("OperationASTNode.operation", () => {
        it("should return opType", () => {
            forOpTypes((type: OperationType) => {
                expect(new TestNode(type).operation).to.equal(type);
            });
        });
    });

    describe("OperationASTNode.applyOperator()", () => {
        it("should correctly evaluate operations", () => {
            forOpTypes((type: OperationType) => {
                let expected = null;
                let a = Math.floor(Math.random() * 15000);
                let b = Math.floor(Math.random() * 15000);
                switch (type) {
                    case OperationType.Negation: expected = -a; break;
                    case OperationType.BitwiseNOT: expected = ~a; break;
                    case OperationType.LogicalNOT: expected = a === 0 ? 0 : 1; break;
                    case OperationType.Addition: expected = a + b; break;
                    case OperationType.Subtraction: expected = a - b; break;
                    case OperationType.Multiplication: expected = a * b; break;
                    case OperationType.Division: expected = a / b; break;
                    case OperationType.LessThan: expected = a < b; break;
                    case OperationType.MoreThan: expected = a > b; break;
                    case OperationType.Equal: expected = a === b; break;
                    case OperationType.NotEqual: expected = a !== b; break;
                    case OperationType.MoreThanEqual: expected = a >= b; break;
                    case OperationType.LessThanEqual: expected = a <= b; break;
                    case OperationType.LogicalOR: expected = a | b; break;
                    case OperationType.LogicalAND: expected = a & b; break;
                }

                if (typeof(expected) === "boolean") expected = expected ? 1 : 0;
                if (Number.isNaN(expected)) expected = null;

                expect(OperationASTNode.applyOperator(type, [a, b])).to.equal(expected);
            });
        });

        it("should correctly evaluate logicalNOT", () => {
            expect(OperationASTNode.applyOperator(OperationType.LogicalNOT, [14])).to.equal(1);
            expect(OperationASTNode.applyOperator(OperationType.LogicalNOT, [1])).to.equal(1);
            expect(OperationASTNode.applyOperator(OperationType.LogicalNOT, [-24])).to.equal(1);
            expect(OperationASTNode.applyOperator(OperationType.LogicalNOT, [-1])).to.equal(1);
            expect(OperationASTNode.applyOperator(OperationType.LogicalNOT, [0])).to.equal(0);
        });

        it("should return null on NaN operations", () => {
            // 0 / 0 === NaN
            expect(OperationASTNode.applyOperator(OperationType.Division, [0, 0])).to.be.null;
        });
    });
});
