import { Token } from "./token";

export class Parser {
    private tokens: Token[];
    private position: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.position = 0;
    }

    private currentToken() {
        return this.tokens[this.position];
    }

    private getToken(requiredTokenType: string[]) {
        const token = this.currentToken();

        if (!token.isEqualType(requiredTokenType)) {
            throw new Error(`Invalid syntax -> expected: ${requiredTokenType}`);
        }

        this.position++;

        return token;
    }

    private getPrecedence(operator: string) {
        switch (operator) {
            case "(":
                return 9;
            case "**":
                return 8;
            case "unary":
                return 7;
            case "*":
            case "/":
            case "%":
                return 6;
            case "+":
            case "-":
                return 5;
            case "<":
            case "<=":
            case ">":
            case ">=":
                return 4;
            case "==":
            case "!=":
                return 3;
            case "&&":
                return 2;
            case "||":
                return 1;
        }

        return 0;
    }

    private expressionWithParenthesis() {
        this.getToken(["left parenthesis"]);
        const expressionResult = this.expression();
        this.getToken(["right parenthesis"]);

        return expressionResult;
    }

    private parseUnary() {
        const token = this.getToken(["unary operator"]);

        switch (token.value) {
            case "+":
                return this.expression(this.getPrecedence("unary"));
            case "-":
                return -this.expression(this.getPrecedence("unary"));
            case "!":
                return !this.expression(this.getPrecedence("unary"));
            case "sin":
                return Math.sin(this.expressionWithParenthesis());
            case "cos":
                return Math.cos(this.expressionWithParenthesis());
            case "tan":
                return Math.tan(this.expressionWithParenthesis());
            case "arcsin":
                return Math.asin(this.expressionWithParenthesis());
            case "arccos":
                return Math.acos(this.expressionWithParenthesis());
            case "arctan":
                return Math.atan(this.expressionWithParenthesis());
            case "log2":
                return Math.log2(this.expressionWithParenthesis());
            case "log10":
                return Math.log10(this.expressionWithParenthesis());
            case "ceil":
                return Math.ceil(this.expressionWithParenthesis());
            case "floor":
                return Math.floor(this.expressionWithParenthesis());
            case "trunc":
                return Math.trunc(this.expressionWithParenthesis());
            case "abs":
                return Math.abs(this.expressionWithParenthesis());
            case "sqrt":
                return Math.sqrt(this.expressionWithParenthesis());
        }
    }

    private parseInfix(left: number) {
        const token = this.getToken(["binary operator"]);
        const precedence = this.getPrecedence(token.value);

        switch (token.value) {
            case "+":
                return left + this.expression(precedence);
            case "-":
                return left - this.expression(precedence);
            case "*":
                return left * this.expression(precedence);
            case "/":
                return left / this.expression(precedence);
            case "**":
                return left ** this.expression(precedence - 1);
            case "%":
                return left % this.expression(precedence);
            case "<":
                return left < this.expression(precedence);
            case "<=":
                return left <= this.expression(precedence);
            case ">":
                return left > this.expression(precedence);
            case ">=":
                return left >= this.expression(precedence);
            case "==":
                return left == this.expression(precedence);
            case "!=":
                return left != this.expression(precedence);
            case "&&":
                return left && this.expression(precedence);
            case "||":
                return left || this.expression(precedence);
        }
    }

    private parsePrefix() {
        if (this.currentToken().isEqualType(["left parenthesis"])) {
            return this.expressionWithParenthesis();
        }

        if (this.currentToken().isEqualType(["unary operator"])) {
            return this.parseUnary();
        }

        const token = this.getToken(["number"]);

        return token.value;
    }

    expression(previousTokenPrecedence: number = 0): number {
        let left = this.parsePrefix();

        while (
            previousTokenPrecedence <
            this.getPrecedence(this.currentToken().value)
        ) {
            left = this.parseInfix(left);
        }

        return left;
    }

    startParse() {
        const result = this.expression();
        const token = this.currentToken();

        if (token.isEqualType(["EOF"])) {
            return result;
        }

        throw new Error(
            `Invalid syntax -> parsing couldn't be finished because ${token.value} is not valid in this expression`
        );
    }
}
