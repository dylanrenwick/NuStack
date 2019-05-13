import { expect } from "chai";
import { FunctionASTNode } from "../../src/AST/FunctionASTNode";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";

describe("ProgramASTNode:", () => {
    describe("ProgramASTNode.constructor()", () => {
        it("should correctly assign the entry point to main", () => {
            expect(new ProgramASTNode(null)["main"]).to.equal(null);
            let sub = new FunctionASTNode("main", "int", []);
            expect(new ProgramASTNode([sub])["main"]).to.equal(sub);
        });
        it("should error when given no valid entry point", () => {
            let sub = new FunctionASTNode("", "", []);
            let func = () => { new ProgramASTNode([sub]); };
            expect(func).to.throw("No function of signature 'int main()' found. Could not get entry point");
        });
    });

    describe("ProgramASTNode.childNodes", () => {
        it("should correctly return the given functions", () => {
            expect(new ProgramASTNode(null).childNodes).to.equal(null);
            let sub = new FunctionASTNode("", "", []);
            expect(new ProgramASTNode([sub]).childNodes).to.deep.equal([sub]);
        });
    });
});
