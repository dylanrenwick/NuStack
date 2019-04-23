import { expect } from "chai";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";
import { SubroutineASTNode } from "../../src/AST/SubroutineASTNode";

describe("ProgramASTNode:", () => {
    describe("ProgramASTNode.constructor()", () => {
        it("should correctly assign its given argument to mainSub", () => {
            expect(new ProgramASTNode(null)["mainSub"]).to.equal(null);
            let sub = new SubroutineASTNode("", "", []);
            expect(new ProgramASTNode(sub)["mainSub"]).to.equal(sub);
        });
    });

    describe("ProgramASTNode.childNodes", () => {
        it("should correctly return the mainSub", () => {
            expect(new ProgramASTNode(null).childNodes).to.equal(null);
            let sub = new SubroutineASTNode("", "", []);
            expect(new ProgramASTNode(sub).childNodes).to.equal(sub);
        });
    });
});
