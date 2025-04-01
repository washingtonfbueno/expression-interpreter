import {
	ASTNode,
	BinaryOperator,
	NumberLiteral,
	UnaryOperator,
} from "./ast-tree";
import { Token } from "./token";

export class Parser {
	private tokens: Token[];
	private position: number;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
		this.position = 0;
	}

	private currentToken(): Token {
		return this.tokens[this.position];
	}

	private getToken(requiredTokenType: string[]): Token {
		const token = this.currentToken();

		if (!token.isEqualType(requiredTokenType)) {
			throw new Error(`Invalid syntax -> expected: ${requiredTokenType}`);
		}

		this.position++;

		return token;
	}

	private getPrecedence(operator: string): number {
		switch (operator) {
			case "(":
				return 5;
			case "**":
				return 4;
			case "unary":
				return 3;
			case "*":
			case "/":
				return 2;
			case "+":
			case "-":
				return 1;
		}

		return 0;
	}

	private expressionWithParenthesis(): ASTNode {
		this.getToken(["left parenthesis"]);
		const expressionResult = this.expression();
		this.getToken(["right parenthesis"]);

		return expressionResult;
	}

	private parseUnary(): ASTNode {
		const token = this.getToken(["unary operator"]);

		return new UnaryOperator(
			token.value,
			this.expression(this.getPrecedence("unary"))
		);
	}

	private parseInfix(left: ASTNode) {
		const token = this.getToken(["binary operator"]);
		const precedence = this.getPrecedence(token.value);

		switch (token.value) {
			case "**":
				return new BinaryOperator(
					left,
					token.value,
					this.expression(precedence - 1)
				);
			default:
				return new BinaryOperator(
					left,
					token.value,
					this.expression(precedence)
				);
		}
	}

	private parsePrefix(): ASTNode {
		if (this.currentToken().isEqualType(["left parenthesis"])) {
			return this.expressionWithParenthesis();
		}

		if (this.currentToken().isEqualType(["unary operator"])) {
			return this.parseUnary();
		}

		const token = this.getToken(["number"]);

		return new NumberLiteral(token.value);
	}

	expression(previousTokenPrecedence: number = 0): ASTNode {
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
