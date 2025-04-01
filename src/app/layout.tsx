import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Expression interpreter",
	description: "",
	icons: "favicon.ico",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
