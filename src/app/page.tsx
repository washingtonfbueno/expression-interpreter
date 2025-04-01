"use client";
import {
	Button,
	Field,
	Input,
	Stack,
	Box,
	Text,
	Alert,
	Container,
} from "@chakra-ui/react";
import { useState } from "react";
import { getAST } from "./interpreter";
import { ASTNode } from "./interpreter/ast-tree";

export default function Home() {
	const [expression, setExpression] = useState("");
	const [result, setResult] = useState<ASTNode | null>(null);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = (event: any) => {
		event.preventDefault();

		try {
			const ast = getAST(expression);
			setResult(ast);
			setError(null);
		} catch (err) {
			console.log();
			setResult(null);
			setError(String(err));
		}
	};

	return (
		<Container>
			<Box height="xl" padding={12}>
				<form onSubmit={onSubmit}>
					<Stack gap="4" align="flex-start" maxW="sm">
						<Field.Root>
							<Field.Label>Expression</Field.Label>
							<Input
								value={expression}
								onChange={(e) => setExpression(e.target.value)}
							/>
						</Field.Root>

						<Button type="submit">Evaluate</Button>
					</Stack>
				</form>

				{/* Render the result or error message */}
				{result && (
					<Box mt={6}>
						<Text fontWeight="bold">Result: {result.eval()}</Text>
						<Box
							borderWidth="1px"
							borderRadius="md"
							padding="4"
							backgroundColor="gray.100"
							maxHeight="300px"
							overflowY="auto"
						>
							<Text fontSize="sm" whiteSpace="pre-wrap">
								{JSON.stringify(result, null, 4)}
							</Text>
						</Box>
					</Box>
				)}

				{error && (
					<Alert.Root mt={6} status="error">
						<Alert.Indicator />
						<Alert.Title>{error}</Alert.Title>
					</Alert.Root>
				)}
			</Box>
		</Container>
	);
}
