import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Block Explorer",
	description: "A block explorer built with Next.js and Blockscout API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	// suppressHydrationWarning needed for ThemeProvider
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
