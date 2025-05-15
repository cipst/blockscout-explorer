"use client";

import type React from "react";

// import { Inter } from "next/font/google"
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import "./global.css";

// const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 items-center">
					<div className="ml-4 flex">
						<Link href="/" className="mr-6 flex items-center space-x-2">
							<span className="font-bold">Pedro Explorer</span>
						</Link>
						<nav className="flex items-center space-x-6 text-sm font-medium">
							<Link
								href="/"
								className={cn("transition-colors hover:text-foreground/80", pathname === "/" ? "text-foreground" : "text-foreground/60")}>
								Home
							</Link>
							<Link
								href="/blocks"
								className={cn(
									"transition-colors hover:text-foreground/80",
									pathname?.startsWith("/blocks") ? "text-foreground" : "text-foreground/60"
								)}>
								Blocks
							</Link>
							<Link
								href="/transactions"
								className={cn(
									"transition-colors hover:text-foreground/80",
									pathname?.startsWith("/transactions") ? "text-foreground" : "text-foreground/60"
								)}>
								Transactions
							</Link>
						</nav>
					</div>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<footer className="border-t py-6">
				{/* <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row"> */}
				<p className="text-center text-sm leading-loose text-muted-foreground">
					Built with Blockscout API. All blockchain data is provided by Blockscout.
				</p>
				{/* </div> */}
			</footer>
		</div>
	);
}
