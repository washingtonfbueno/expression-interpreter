import { ASTNode } from "./ast-tree";
import { Lexer } from "./lexer";

import { Parser } from "./parser";

export const getAST = (expression: string): ASTNode => {
	const lexer = new Lexer(expression);

	if (!lexer.allTokensValid()) {
		throw new Error(
			"Invalid syntax -> expected: valid operator or operand"
		);
	}

	const tokens = lexer.getTokens();

	const parser = new Parser(tokens);

	return parser.startParse();
};
