import { expect } from "chai";
import { FunctionASTNode } from "../../src/AST/FunctionASTNode";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";

describe("ProgramASTNode:", () => {
    describe("ProgramASTNode.constructor()", () => {
        it("should correctly assign the entry point to main", () => {
            let sub = new FunctionASTNode("main", "int", []);
            expect(new ProgramASTNode([sub], [])["main"]).to.equal(sub);
        });
        it("should leave entry point undefined when main does not exist", () => {
            let sub = new FunctionASTNode("", "", []);
            expect(new ProgramASTNode([sub], [])["main"]).to.equal(undefined);
        });
    });

    describe("ProgramASTNode.childNodes", () => {
        it("should correctly return the given functions", () => {
            let sub = new FunctionASTNode("main", "int", []);
            expect(new ProgramASTNode([sub], []).childNodes).to.deep.equal([sub]);
        });
    });
});
