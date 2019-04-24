import { expect } from "chai";
import { AbstractSyntaxTree } from "../../src/AST/AbstractSyntaxTree";
import { ASTSimplifier } from "../../src/AST/ASTSimplifier";
import { ConstantASTNode } from "../../src/AST/ConstantASTNode";
import { DiadicASTNode } from "../../src/AST/DiadicASTNode";
import { ExpressionASTNode } from "../../src/AST/ExpressionASTNode";
import { MonadicASTNode } from "../../src/AST/MonadicASTNode";
import { OperationType } from "../../src/AST/OperationASTNode";
import { ProgramASTNode } from "../../src/AST/ProgramASTNode";
import { ReturnStatementASTNode } from "../../src/AST/ReturnStatementASTNode";
import { StatementASTNode } from "../../src/AST/StatementASTNode";
import { SubroutineASTNode } from "../../src/AST/SubroutineASTNode";

// Un-evaluable expression
class TestExpressionNode extends ExpressionASTNode { get expressionValue(): any { return null; } }
// Un-evaluable expression
class TestStatementNode extends StatementASTNode { get expressionValue(): any { return null; } }

describe("ASTSimplifier", () => {
    describe("ASTSimplifier.simplifyExpression()", () => {
        it("should correctly simplify evaluable expressions to constants", () => {
            let expr: ExpressionASTNode = new DiadicASTNode(
                OperationType.Addition,
                new ConstantASTNode(2),
                new ConstantASTNode(4)
            );
            let simplified = ASTSimplifier["simplifyExpression"].bind(ASTSimplifier, expr)();
            expect(simplified instanceof ConstantASTNode).to.be.true;
            expect(simplified.expressionValue).to.equal(6);

            expr = new MonadicASTNode(OperationType.Negation, new ConstantASTNode(5));
            simplified = ASTSimplifier["simplifyExpression"].bind(ASTSimplifier, expr)();
            expect(simplified instanceof ConstantASTNode).to.be.true;
            expect(simplified.expressionValue).to.equal(-5);
        });

        it("should not modify un-evaluable expressions", () => {
            let expr = new TestExpressionNode();
            let simplified = ASTSimplifier["simplifyExpression"].bind(ASTSimplifier, expr)();
            expect(simplified).to.equal(expr);
        });
    });

    describe("ASTSimplifier.simplifyStatement()", () => {
        it("should simplify the expression of a return statement", () => {
            let expr: StatementASTNode = new ReturnStatementASTNode(
                new DiadicASTNode(
                    OperationType.Addition,
                    new ConstantASTNode(2),
                    new ConstantASTNode(4)
                )
            );
            let simplified = ASTSimplifier["simplifyStatement"].bind(ASTSimplifier, expr)();
            expect(simplified.childNodes instanceof ConstantASTNode).to.be.true;
            expect(simplified.childNodes.expressionValue).to.equal(6);

            expr = new ReturnStatementASTNode(
                new MonadicASTNode(OperationType.Negation, new ConstantASTNode(5))
            );
            simplified = ASTSimplifier["simplifyStatement"].bind(ASTSimplifier, expr)();
            expect(simplified.childNodes instanceof ConstantASTNode).to.be.true;
            expect(simplified.childNodes.expressionValue).to.equal(-5);
        });

        it("should not modify other statement types", () => {
            let expr = new TestStatementNode();
            let simplified = ASTSimplifier["simplifyStatement"].bind(ASTSimplifier, expr)();
            expect(simplified).to.equal(expr);
        });
    });

    describe("ASTSimplifier.simplifySubroutine()", () => {
        it("should create a new subroutine with all statements simplified", () => {
            let sub: SubroutineASTNode = new SubroutineASTNode(
                "", "", [
                    new ReturnStatementASTNode(
                        new DiadicASTNode(
                            OperationType.Addition,
                            new ConstantASTNode(2),
                            new ConstantASTNode(4)
                        )
                    )
                ]
            );
            let simplified = ASTSimplifier["simplifySubroutine"].bind(ASTSimplifier, sub)();
            expect(simplified).to.not.equal(sub);
            expect(simplified.childNodes.length).to.equal(1);
            expect(simplified.childNodes[0] instanceof ReturnStatementASTNode).to.be.true;
            expect(simplified.childNodes[0].childNodes instanceof ConstantASTNode).to.be.true;
            expect(simplified.childNodes[0].childNodes.expressionValue).to.equal(6);
        });

        it("should create a new subroutine even when no statements can be simplified", () => {
            let expr = new TestStatementNode();
            let sub: SubroutineASTNode = new SubroutineASTNode(
                "", "", [
                    expr
                ]
            );
            let simplified = ASTSimplifier["simplifySubroutine"].bind(ASTSimplifier, sub)();
            expect(simplified).to.not.equal(sub);
            expect(simplified.childNodes.length).to.equal(1);
            expect(simplified.childNodes[0]).to.equal(expr);
        });
    });

    describe("ASTSimplifier.SimplifyTree()", () => {
        it("should replace the ProgramASTNode of a tree with a simplified copy", () => {
            let root = new ProgramASTNode(
                new SubroutineASTNode("", "", [
                    new ReturnStatementASTNode(
                        new DiadicASTNode(
                            OperationType.Addition,
                            new ConstantASTNode(2),
                            new ConstantASTNode(4)
                        )
                    )
                ])
            );
            let tree = new AbstractSyntaxTree(root);
            let simplified = ASTSimplifier.SimplifyTree(tree);
            expect(simplified.root).to.not.equal(root);
            expect(simplified.root.childNodes.childNodes[0].childNodes instanceof ConstantASTNode).to.be.true;
            expect(simplified.root.childNodes.childNodes[0].childNodes.expressionValue).to.equal(6);
        });
    });
});
