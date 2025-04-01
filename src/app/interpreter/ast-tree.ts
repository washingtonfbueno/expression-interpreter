export interface ASTNode {
	value: string;
	eval: () => number;
}

export class NumberLiteral implements ASTNode {
	value: string;

	constructor(value: string) {
		this.value = value;
	}

	eval(): number {
		return parseFloat(this.value);
	}
}

export class BinaryOperator implements ASTNode {
	value: string;

	constructor(private left: ASTNode, value: string, private right: ASTNode) {
		this.value = value;
	}

	eval(): number {
		switch (this.value) {
			case "+":
				return this.left.eval() + this.right.eval();
			case "-":
				return this.left.eval() - this.right.eval();
			case "*":
				return this.left.eval() * this.right.eval();
			case "/":
				return this.left.eval() / this.right.eval();
			case "**":
				return this.left.eval() ** this.right.eval();
			default:
				throw new Error(`Unknown operator: ${this.value}`);
		}
	}
}

export class UnaryOperator implements ASTNode {
	value: string;

	constructor(value: string, private left: ASTNode) {
		this.value = value;
	}

	eval(): number {
		switch (this.value) {
			case "+":
				return +this.left.eval();
			case "-":
				return -this.left.eval();
			default:
				throw new Error(`Unknown unary operator: ${this.value}`);
		}
	}
}
