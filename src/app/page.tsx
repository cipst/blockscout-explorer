"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockList } from "@/components/block-list";
import { TransactionList } from "@/components/transaction-list";
import { NetworkStats } from "@/components/network-stats";

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		// Determine if the search query is a block number, transaction hash, or address
		if (/^\d+$/.test(searchQuery)) {
			router.push(`/block/${searchQuery}`);
		} else if (searchQuery.startsWith("0x") && searchQuery.length === 66) {
			router.push(`/tx/${searchQuery}`);
		} else if (searchQuery.startsWith("0x") && searchQuery.length === 42) {
			router.push(`/address/${searchQuery}`);
		} else {
			// Handle invalid search query
			console.error("Invalid search query");
			alert("Invalid search query");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold">Blockchain Explorer</h1>
					<form onSubmit={handleSearch} className="flex w-full max-w-3xl gap-2">
						<Input
							placeholder="Search by Address / Txn Hash / Block / Token"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-1"
						/>
						<Button type="submit">
							<Search className="h-4 w-4 mr-2" />
							Search
						</Button>
					</form>
				</div>

				<NetworkStats />

				<Tabs defaultValue="blocks" className="w-full">
					<TabsList>
						<TabsTrigger value="blocks">Latest Blocks</TabsTrigger>
						<TabsTrigger value="transactions">Latest Transactions</TabsTrigger>
					</TabsList>
					<TabsContent value="blocks">
						<Card>
							<CardHeader>
								<CardTitle>Latest Blocks</CardTitle>
								<CardDescription>The most recently mined blocks on the blockchain</CardDescription>
							</CardHeader>
							<CardContent>
								<BlockList />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="transactions">
						<Card>
							<CardHeader>
								<CardTitle>Latest Transactions</CardTitle>
								<CardDescription>The most recent transactions on the blockchain</CardDescription>
							</CardHeader>
							<CardContent>
								<TransactionList />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
