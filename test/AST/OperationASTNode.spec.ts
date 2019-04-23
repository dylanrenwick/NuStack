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
});
