import { expect } from "chai";
import { ValueType } from "../../src/AST/ExpressionASTNode";
import { FunctionASTNode } from "../../src/AST/FunctionASTNode";
import { ReturnStatementASTNode } from "../../src/AST/ReturnStatementASTNode";

describe("FunctionASTNode", () => {
    describe("FunctionASTNode.constructor()", () => {
        it("should correctly assign name and returnType", () => {
            let node = new FunctionASTNode("name", "int", []);
            expect(node["funcName"]).to.equal("name");
            expect(node["return"].type).to.equal(ValueType.int);
            expect(node["return"].isArray).to.be.false;
            node = new FunctionASTNode("hello", "string", []);
            expect(node["funcName"]).to.equal("hello");
            expect(node["return"].type).to.equal(ValueType.char);
            expect(node["return"].isArray).to.be.true;
            node = new FunctionASTNode("", "", []);
            expect(node["funcName"]).to.equal("");
            expect(node["return"]).to.equal(null);
        });

        it("should correctly assign children", () => {
            let node = new FunctionASTNode("", "", []);
            expect(node["children"]).to.deep.equal([]);
            node = new FunctionASTNode("", "", [null]);
            expect(node["children"]).to.deep.equal([null]);
            let innerNode = new ReturnStatementASTNode(null);
            node = new FunctionASTNode("", "", [ innerNode ]);
            expect(node["children"]).to.deep.equal([ innerNode ]);
        });
    });

    describe("FunctionASTNode.childNodes", () => {
        it("should return the node's children", () => {
            let node = new FunctionASTNode("", "", []);
            expect(node.childNodes).to.deep.equal([]);
            node = new FunctionASTNode("", "", [null]);
            expect(node.childNodes).to.deep.equal([null]);
            let innerNode = new ReturnStatementASTNode(null);
            node = new FunctionASTNode("", "", [ innerNode ]);
            expect(node.childNodes).to.deep.equal([ innerNode ]);
        });
    });

    describe("FunctionASTNode.name", () => {
        it("should return the subroutine's name", () => {
            let node = new FunctionASTNode("name", "", []);
            expect(node.name).to.equal("name");
            node = new FunctionASTNode("hello", "", []);
            expect(node.name).to.equal("hello");
            node = new FunctionASTNode("", "", []);
            expect(node.name).to.equal("");
        });
    });

    describe("FunctionASTNode.returnType", () => {
        it("should return the subroutine's returnType", () => {
            let node = new FunctionASTNode("", "bool", []);
            expect(node.returnType.type).to.equal(ValueType.bool);
            node = new FunctionASTNode("", "int", []);
            expect(node.returnType.type).to.equal(ValueType.int);
            node = new FunctionASTNode("", "", []);
            expect(node.returnType).to.equal(null);
        });
    });
});
