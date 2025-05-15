"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Clock } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { fetchLatestTransactions } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionData } from "@/lib/types";

export function TransactionList() {
	const [transactions, setTransactions] = useState<TransactionData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getTransactions = async () => {
			try {
				const data = await fetchLatestTransactions();
				setTransactions(data);
			} catch (error) {
				console.error("Failed to fetch transactions:", error);
			} finally {
				setLoading(false);
			}
		};

		getTransactions();
		const interval = setInterval(getTransactions, 15000); // Refresh every 15 seconds
		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center space-x-4">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-[250px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Txn Hash</TableHead>
					<TableHead>Age</TableHead>
					<TableHead>From</TableHead>
					<TableHead>To</TableHead>
					<TableHead>Value</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions.map((tx) => (
					<TableRow key={tx.hash}>
						<TableCell className="font-medium">
							<Link href={`/tx/${tx.hash}`} className="flex items-center text-primary hover:underline">
								<ArrowLeftRight className="mr-2 h-4 w-4" />
								{tx.hash.substring(0, 10)}...
							</Link>
						</TableCell>
						<TableCell>
							<div className="flex items-center text-muted-foreground">
								<Clock className="mr-2 h-4 w-4" />
								{formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
							</div>
						</TableCell>
						<TableCell>
							<Link href={`/address/${tx.from}`} className="text-primary hover:underline">
								{tx.from.substring(0, 8)}...
							</Link>
						</TableCell>
						<TableCell>
							<Link href={`/address/${tx.to}`} className="text-primary hover:underline">
								{tx.to.substring(0, 8)}...
							</Link>
						</TableCell>
						<TableCell>{tx.value} ETH</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
