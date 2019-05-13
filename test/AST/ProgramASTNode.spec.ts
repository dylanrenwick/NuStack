import { expect } from "chai";
import { FunctionASTNode } from "../../src/AST/FunctionASTNode";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";

describe("ProgramASTNode:", () => {
    describe("ProgramASTNode.constructor()", () => {
        it("should correctly assign its given argument to mainSub", () => {
            expect(new ProgramASTNode(null)["mainSub"]).to.equal(null);
            let sub = new FunctionASTNode("", "", []);
            expect(new ProgramASTNode(sub)["mainSub"]).to.equal(sub);
        });
    });

    describe("ProgramASTNode.childNodes", () => {
        it("should correctly return the mainSub", () => {
            expect(new ProgramASTNode(null).childNodes).to.equal(null);
            let sub = new FunctionASTNode("", "", []);
            expect(new ProgramASTNode(sub).childNodes).to.equal(sub);
        });
    });
});
