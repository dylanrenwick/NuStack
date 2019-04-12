export class Tokenizer {
    private static tokens: string[] = [];
    public static get Tokens(): string[] { return this.tokens; }

    private static singletons: string = ",.:;{}()[]$\\";
    private static reps: string = "<>&|!=+-^*";
    private static seps: string = " \t\n";
    private static digits: string = "0123456789";
    private static forbid: string = "~`@%'";

    public static Tokenize(input: string): void {
        let inChars: string = input.toLowerCase();

        let curToken: string = "";

        let quote: boolean = false;

        for (let curChar of inChars) {
            if (this.forbid.includes(curChar)) {
                throw new Error("error: forbidden character " + curChar);
            }
            if (quote) {
                if (curChar === "\"") {
                    this.tokens.push(curToken);
                    curToken = "";
                    quote = false;
                } else {
                    curToken += curChar;
                }

                continue;
            }

            if (curChar === "#" || curToken + curChar === "//") break;

            if (curChar === "\"") {
                quote = true;
                continue;
            }

            if (curChar === "-") {
                if (curToken.length > 0) {
                    this.tokens.push(curToken);
                    curToken = "";
                }

                if (this.tokens.length > 0) {
                    let prev: string = this.tokens[this.tokens.length - 1];
                    if (prev.endsWith("-") || prev.endsWith("+")) {
                        this.tokens[this.tokens.length - 1] += curChar;
                    } else {
                        this.tokens.push(curChar);
                    }
                } else {
                    this.tokens.push(curChar);
                }

                continue;
            }

            if (this.singletons.includes(curChar)) {
                if (curToken.length > 0) {
                    this.tokens.push(curToken);
                    curToken = "";
                }
                this.tokens.push(curChar);
                continue;
            }

            if (this.reps.includes(curChar)) {
                if (curToken.length > 0) {
                    this.tokens.push(curToken);
                    curToken = "";
                }
                let prev: string = null;
                if (this.tokens.length > 0) {
                    prev = this.tokens[this.tokens.length - 1];
                }
                if (prev !== null
                    && this.reps.includes(prev.substring(prev.length - 1))) {
                        this.tokens[this.tokens.length - 1] += curChar;
                } else {
                    this.tokens.push(curChar);
                }
                continue;
            }
            if (this.seps.includes(curChar)) {
                if (curToken.length > 0) {
                    this.tokens.push(curToken);
                    curToken = "";
                }
                continue;
            }
            if (this.digits.includes(curChar)) {
                if (this.tokens.length > 1) {
                    let prev: string = this.tokens[this.tokens.length - 1];
                    let prevPrev: string = this.tokens[this.tokens.length - 2]
                        .substring(this.tokens[this.tokens.length - 2].length - 1);
                    if (curToken.length === 0 && prev === "-"
                        && (this.reps + this.seps).includes(prevPrev)) {
                        curToken = this.tokens.pop();
                    }
                }
            }
            curToken += curChar;
        }
        if (curToken.length > 0) {
            this.tokens.push(curToken);
            curToken = "";
        }
    }
}
