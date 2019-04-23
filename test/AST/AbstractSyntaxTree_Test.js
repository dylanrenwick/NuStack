const expect = require('chai').expect;
const AbstractSyntaxTree = require("../../bin/AST/AbstractSyntaxTree").AbstractSyntaxTree;
const ProgramASTNode = require("../../bin/AST/ProgramASTNode").ProgramASTNode;

describe("AbstractSyntaxTree.constructor()", function() {
    it("should correctly assign the root node", function() {
        let rootNode = new ProgramASTNode();

        expect(new AbstractSyntaxTree(rootNode).root).to.equal(rootNode);
    });
});