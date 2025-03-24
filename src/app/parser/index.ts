import { Lexer } from "./lexer";

import { Parser } from "./parser";

export const evaluateExpression = (expressionInput: string) => {
    const lexer = new Lexer(expressionInput);

    if (!lexer.allTokensValid()) {
        return "Invalid syntax -> expected: valid operator or operand";
    }

    const tokens = lexer.getTokens();
    const prattParser = new Parser(tokens);

    try {
        const result = prattParser.startParse();
        return result.toString();
    } catch (e: any) {
        return e.message;
    }
};
