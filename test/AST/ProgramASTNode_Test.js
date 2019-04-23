const expect = require('chai').expect;
const ProgramASTNode = require("../../bin/AST/ProgramASTNode").ProgramASTNode;
const SubroutineASTNode = require("../../bin/AST/SubroutineASTNode").SubroutineASTNode;

describe("ProgramASTNode", function() {
    describe("ProgramASTNode.constructor()", function() {
        it("should correctly assign its given argument to mainSub", function() {
            expect(new ProgramASTNode().mainSub).to.equal(undefined);
            expect(new ProgramASTNode("hi").mainSub).to.equal("hi");
            let sub = new SubroutineASTNode();
            expect(new ProgramASTNode(sub).mainSub).to.equal(sub);
        })
    });

    describe("ProgramASTNode.childNodes", function() {
        it("should correctly return the mainSub", function() {
            expect(new ProgramASTNode().childNodes).to.equal(undefined);
            expect(new ProgramASTNode("hi").childNodes).to.equal("hi");
            let sub = new SubroutineASTNode();
            expect(new ProgramASTNode(sub).childNodes).to.equal(sub);
        });
    });
});