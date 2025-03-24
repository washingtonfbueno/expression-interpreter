import { Token } from "./token";

export const binaryOperators = [
    "&&",
    "||",
    "<=",
    ">=",
    "==",
    "!=",
    "**",
    "*",
    "/",
    "%",
    "<",
    ">",
];

export const unaryOperators = [
    "arcsin",
    "arccos",
    "arctan",
    "trunc",
    "floor",
    "log10",
    "sqrt",
    "ceil",
    "log2",
    "sin",
    "cos",
    "tan",
    "abs",
    "!",
];

export const unaryBinaryOperators = ["+", "-"];

export class Lexer {
    private expression: string;
    private tokens: Token[];

    constructor(expression: string) {
        this.expression = expression;
        this.tokens = [];
        this.findValidtokens();

        const eof = new Token(["EOF"], "\0", 1);
        this.tokens.push(eof);
    }

    getTokens() {
        return this.tokens;
    }

    allTokensValid() {
        for (let token of this.tokens) {
            if (token.isEqualType(["error"])) {
                return false;
            }
        }

        return true;
    }

    private startsWithBinaryOperator() {
        for (let operator of binaryOperators) {
            if (this.expression.startsWith(operator)) {
                return new Token(
                    ["binary operator"],
                    operator,
                    operator.length
                );
            }
        }

        return null;
    }

    private startsWithUnaryOperator() {
        for (let operator of unaryOperators) {
            if (this.expression.startsWith(operator)) {
                return new Token(["unary operator"], operator, operator.length);
            }
        }

        return null;
    }

    private startsWithUnaryBinaryOperator() {
        for (let operator of unaryBinaryOperators) {
            if (this.expression.startsWith(operator)) {
                return new Token(
                    ["unary operator", "binary operator"],
                    operator,
                    operator.length
                );
            }
        }

        return null;
    }

    private startsWithNumber() {
        const number = this.expression.match(/^(\d+)(\.\d+)?/);

        return number
            ? new Token(["number"], Number(number[0]), number[0].length)
            : null;
    }

    private startsWithParenthesis() {
        if (this.expression.startsWith("(")) {
            return new Token(["left parenthesis"], "(", 1);
        }

        if (this.expression.startsWith(")")) {
            return new Token(["right parenthesis"], ")", 1);
        }

        return null;
    }

    private findValidtokens() {
        while (this.expression) {
            let matched = false;

            for (let getToken of [
                this.startsWithParenthesis,
                this.startsWithUnaryBinaryOperator,
                this.startsWithBinaryOperator,
                this.startsWithUnaryOperator,
                this.startsWithNumber,
            ]) {
                getToken = getToken.bind(this);

                const token = getToken();

                if (token) {
                    this.tokens.push(token);
                    this.expression = this.expression.slice(token.length);

                    matched = true;
                    break;
                }
            }

            if (matched) {
                continue;
            }

            const spaces = this.expression.match(/^\s+/);

            if (spaces) {
                this.expression = this.expression.slice(spaces[0].length);
                continue;
            }

            const invalidToken = this.expression.match(/^[^\s]/);

            if (invalidToken) {
                this.expression = this.expression.slice(invalidToken.length);

                const token = new Token(["error"], invalidToken[0], 1);
                this.tokens.push(token);
            }
        }
    }
}
