import { expect } from "chai";
import { ReturnStatementASTNode } from "../../src/AST/ReturnStatementASTNode";
import { SubroutineASTNode } from "../../src/AST/SubroutineASTNode";

describe("SubroutineASTNode", () => {
    describe("SubroutineASTNode.constructor()", () => {
        it("should correctly assign name and returnType", () => {
            let node = new SubroutineASTNode("name", "returnType", []);
            expect(node["subName"]).to.equal("name");
            expect(node["return"]).to.equal("returnType");
            node = new SubroutineASTNode("hello", "goodbye", []);
            expect(node["subName"]).to.equal("hello");
            expect(node["return"]).to.equal("goodbye");
            node = new SubroutineASTNode("", "", []);
            expect(node["subName"]).to.equal("");
            expect(node["return"]).to.equal("");
        });

        it("should correctly assign children", () => {
            let node = new SubroutineASTNode("", "", []);
            expect(node["children"]).to.deep.equal([]);
            node = new SubroutineASTNode("", "", [null]);
            expect(node["children"]).to.deep.equal([null]);
            let innerNode = new ReturnStatementASTNode(null);
            node = new SubroutineASTNode("", "", [ innerNode ]);
            expect(node["children"]).to.deep.equal([ innerNode ]);
        });
    });

    describe("SubroutineASTNode.childNodes", () => {
        it("should return the node's children", () => {
            let node = new SubroutineASTNode("", "", []);
            expect(node.childNodes).to.deep.equal([]);
            node = new SubroutineASTNode("", "", [null]);
            expect(node.childNodes).to.deep.equal([null]);
            let innerNode = new ReturnStatementASTNode(null);
            node = new SubroutineASTNode("", "", [ innerNode ]);
            expect(node.childNodes).to.deep.equal([ innerNode ]);
        });
    });

    describe("SubroutineASTNode.name", () => {
        it("should return the subroutine's name", () => {
            let node = new SubroutineASTNode("name", "", []);
            expect(node.name).to.equal("name");
            node = new SubroutineASTNode("hello", "", []);
            expect(node.name).to.equal("hello");
            node = new SubroutineASTNode("", "", []);
            expect(node.name).to.equal("");
        });
    });

    describe("SubroutineASTNode.returnType", () => {
        it("should return the subroutine's returnType", () => {
            let node = new SubroutineASTNode("", "void", []);
            expect(node.returnType).to.equal("void");
            node = new SubroutineASTNode("", "returnType", []);
            expect(node.returnType).to.equal("returnType");
            node = new SubroutineASTNode("", "", []);
            expect(node.returnType).to.equal("");
        });
    });
});
