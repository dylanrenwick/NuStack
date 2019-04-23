const expect = require('chai').expect;
const AbstractSyntaxTree = require("../../bin/AST/AbstractSyntaxTree").AbstractSyntaxTree;
const ProgramASTNode = require("../../bin/AST/ProgramASTNode").ProgramASTNode;
const SubroutineASTNode = require("../../bin/AST/SubroutineASTNode").SubroutineASTNode;

describe("AbstractSyntaxTree.constructor()", function() {
    it("should correctly assign the root node", function() {
        let rootNode = new ProgramASTNode();

        expect(new AbstractSyntaxTree(rootNode).root).to.equal(rootNode);
    });

    it("should error when given an invalid root node", function() {
        function test(input) {
            new AbstractSyntaxTree(input);
        }

        expect(test.bind(null)).to.throw("Invalid root node");
        expect(test.bind(null, 1)).to.throw("Invalid root node");
        expect(test.bind(null, "no")).to.throw("Invalid root node");
        expect(test.bind(null, new SubroutineASTNode())).to.throw("Invalid root node");
    });
});