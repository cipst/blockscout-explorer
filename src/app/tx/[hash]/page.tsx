"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Check, CuboidIcon as Cube, FileText, X, Zap } from "lucide-react";

import { format } from "date-fns";
import { fetchTransactionDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { TransactionDetailData } from "@/lib/types";

export default function TransactionDetailPage() {
	const { hash } = useParams();
	const [transaction, setTransaction] = useState<TransactionDetailData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getTransactionDetails = async () => {
			try {
				const data = await fetchTransactionDetails(hash as string);
				setTransaction(data);
			} catch (error) {
				console.error("Failed to fetch transaction details:", error);
			} finally {
				setLoading(false);
			}
		};

		if (hash) {
			getTransactionDetails();
		}
	}, [hash]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col gap-8">
					<div className="flex items-center gap-4">
						<Button variant="outline" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<Skeleton className="h-8 w-[300px]" />
					</div>
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-[200px]" />
							<Skeleton className="h-4 w-[300px]" />
						</CardHeader>
						<CardContent className="space-y-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="flex justify-between">
									<Skeleton className="h-4 w-[150px]" />
									<Skeleton className="h-4 w-[250px]" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!transaction) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col gap-8">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button variant="outline" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<h1 className="text-3xl font-bold">Transaction Not Found</h1>
					</div>
					<Card>
						<CardContent className="py-8">
							<p className="text-center text-muted-foreground">The requested transaction could not be found.</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col gap-8">
				<div className="flex items-center gap-4">
					<Link href="/">
						<Button variant="outline" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<h1 className="text-3xl font-bold">Transaction Details</h1>
				</div>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Transaction
							</CardTitle>
							<Badge variant={transaction.status ? "default" : "destructive"}>
								{transaction.status ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
								{transaction.status ? "Success" : "Failed"}
							</Badge>
						</div>
						<CardDescription className="font-mono text-xs break-all">{transaction.hash}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Block</p>
									<Link href={`/block/${transaction.blockNumber}`} className="text-primary hover:underline flex items-center gap-2">
										<Cube className="h-4 w-4" />
										{transaction.blockNumber}
									</Link>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Timestamp</p>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<p>{format(new Date(transaction.timestamp), "PPpp")}</p>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">From</p>
									<Link href={`/address/${transaction.from}`} className="text-sm font-mono break-all text-primary hover:underline">
										{transaction.from}
									</Link>
								</div>
								<div className="flex items-center">
									<ArrowRight className="h-5 w-5 text-muted-foreground mx-auto" />
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">To</p>
									<Link href={`/address/${transaction.to}`} className="text-sm font-mono break-all text-primary hover:underline">
										{transaction.to}
									</Link>
								</div>
							</div>
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Value</p>
									<p className="text-lg font-semibold">{transaction.value} ETH</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Transaction Fee</p>
									<p>{transaction.fee} ETH</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Gas Price</p>
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-muted-foreground" />
										<p>{transaction.gasPrice} Gwei</p>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Gas Limit</p>
									<p>{Number(transaction.gasLimit).toLocaleString()}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Gas Used</p>
									<p>
										{Number(transaction.gasUsed).toLocaleString()} ({((Number(transaction.gasUsed) / Number(transaction.gasLimit)) * 100).toFixed(2)}
										%)
									</p>
								</div>
							</div>
						</div>

						<Separator />

						{transaction.input && transaction.input !== "0x" && (
							<div>
								<p className="text-sm font-medium mb-2">Input Data</p>
								<div className="bg-muted p-4 rounded-md overflow-x-auto">
									<pre className="text-xs font-mono">{transaction.input}</pre>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
