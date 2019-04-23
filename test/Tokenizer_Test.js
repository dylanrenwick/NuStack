const expect = require('chai').expect;
const Tokenizer = require("../bin/Tokenizer").Tokenizer;

describe("Tokenizer.tokenFromString()", function() {
    it("should correctly tokenize a variety of valid tokens", function() {
        let tokens = {
            "int": {tokenType: 0, tokenValue: "int", column: 1, row: 1},
            "main": {tokenType: 1, tokenValue: "main", column: 1, row: 1},
            "(": {tokenType: 2, tokenValue: undefined, column: 1, row: 1},
            ")": {tokenType: 3, tokenValue: undefined, column: 1, row: 1},
            ";": {tokenType: 6, tokenValue: undefined, column: 1, row: 1},
            "17": {tokenType: 7, tokenValue: 17, column: 1, row: 1}
        };

        for (let token in tokens) {
            let generatedToken = Tokenizer.tokenFromString(1, 1, token);

            expect(generatedToken).to.deep.equal(tokens[token]);
        }
    });

    it("should error on invalid token strings", function() {
        let invalidStrings = [
            "#", "%", "\\"
        ];

        for (let invalid of invalidStrings) {
            expect(Tokenizer.tokenFromString.bind(Tokenizer, 1, 1, invalid)).to.throw(Error, `Could not lex token ${invalid} at line: 1, col: 1`);
        }
    });

    it("should correctly pass line and col to the token", function() {
        for (let i = 0; i < 5; i++) {
            let line = Math.floor(Math.random() * 15000), col = Math.floor(Math.random() * 15000);
            let token = Tokenizer.tokenFromString(line, col, ";");
            expect(token).to.satisfy(function(x) {
                return (x.column === col && x.row === line);
            });
        }
    });
});

describe("Tokenizer.tokenize()", function() {
    it("should correctly tokenize a valid program", function() {
        let expected = [
            Tokenizer.tokenFromString(1, 1,  'int'),
            Tokenizer.tokenFromString(1, 5,  'main'),
            Tokenizer.tokenFromString(1, 9, '('),
            Tokenizer.tokenFromString(1, 10, ')'),
            Tokenizer.tokenFromString(1, 12, '{'),
            Tokenizer.tokenFromString(2, 5,  'return'),
            Tokenizer.tokenFromString(2, 12, '2'),
            Tokenizer.tokenFromString(2, 13, ';'),
            Tokenizer.tokenFromString(3, 1,  '}'),
        ];

        let program =
`int main() {
    return 2;
}`;

        expect(Tokenizer.tokenize(program)).to.deep.equal(expected);
    });

    it("should correctly tokenize an invalid program", function() {
        let expected = [
            Tokenizer.tokenFromString(1, 1, 'int'),
            Tokenizer.tokenFromString(1, 5, '('),
            Tokenizer.tokenFromString(1, 6, 'main'),
            Tokenizer.tokenFromString(1, 10, ')'),
            Tokenizer.tokenFromString(1, 12, '{'),
            Tokenizer.tokenFromString(2, 5, 'less'),
            Tokenizer.tokenFromString(2, 10, '<='),
            Tokenizer.tokenFromString(2, 13, '5'),
            Tokenizer.tokenFromString(2, 14, ';'),
            Tokenizer.tokenFromString(2, 16, '>='),
            Tokenizer.tokenFromString(3, 5, '+'),
            Tokenizer.tokenFromString(3, 7, '('),
            Tokenizer.tokenFromString(3, 9, '-'),
            Tokenizer.tokenFromString(3, 10, ';'),
            Tokenizer.tokenFromString(3, 12, 'return'),
            Tokenizer.tokenFromString(4, 1, '}'),
        ];

        let program = 
`int (main) {
    less <= 5; >=
    + ( -; return
}`;

        expect(Tokenizer.tokenize(program)).to.deep.equal(expected);
    });

    it("should error on invalid tokens", function() {
        let invalids = ["#", "%", "\\"];
        
        for (let invalid of invalids) {
            let program =
`int main () {
    return ${invalid};
}`;
            expect(Tokenizer.tokenize.bind(Tokenizer, program)).to.throw(Error, `Unknown character: ${invalid} at line: 2, col: 12`);
        }
    });
});