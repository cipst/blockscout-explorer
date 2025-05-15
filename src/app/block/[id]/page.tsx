"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, CuboidIcon as Cube, FileText, Zap } from "lucide-react";

import { format } from "date-fns";
import { fetchBlockDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlockDetailData } from "@/lib/types";

export default function BlockDetailPage() {
	const { id } = useParams();
	const [block, setBlock] = useState<BlockDetailData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getBlockDetails = async () => {
			try {
				const data = await fetchBlockDetails(id as string);
				setBlock(data);
			} catch (error) {
				console.error("Failed to fetch block details:", error);
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			getBlockDetails();
		}
	}, [id]);

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

	if (!block) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col gap-8">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button variant="outline" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<h1 className="text-3xl font-bold">Block Not Found</h1>
					</div>
					<Card>
						<CardContent className="py-8">
							<p className="text-center text-muted-foreground">The requested block #{id} could not be found.</p>
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
					<h1 className="text-3xl font-bold">Block #{block.height}</h1>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Cube className="h-5 w-5" />
							Block Details
						</CardTitle>
						<CardDescription>Detailed information about block #{block.height}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Block Height</p>
									<p className="text-lg font-semibold">{block.height}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Timestamp</p>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<p>{format(new Date(block.timestamp), "PPpp")}</p>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Transactions</p>
									<div className="flex items-center gap-2">
										<FileText className="h-4 w-4 text-muted-foreground" />
										<p>{block.transaction_count} transactions</p>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Hash</p>
									<p className="text-sm font-mono break-all">{block.hash}</p>
								</div>
							</div>
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">Gas Used</p>
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-muted-foreground" />
										<p>
											{Number(block.gas_used).toLocaleString()} ({((Number(block.gas_used) / Number(block.gas_limit)) * 100).toFixed(2)}%)
										</p>
									</div>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Gas Limit</p>
									<p>{Number(block.gas_limit).toLocaleString()}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Parent Hash</p>
									<Link href={`/block/${Number(block.height) - 1}`} className="text-sm font-mono break-all text-primary hover:underline">
										{block.parent_hash}
									</Link>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">Miner</p>
									<Link href={`/address/${block.miner.hash}`} className="text-sm font-mono break-all text-primary hover:underline">
										{block.miner.hash}
									</Link>
								</div>
							</div>
						</div>

						<Separator />

						<div>
							<p className="text-sm font-medium mb-2">Transactions</p>
							{block.transactions && block.transactions.length > 0 ? (
								<div className="space-y-2">
									{block.transactions.slice(0, 5).map((tx) => (
										<Link key={tx.hash} href={`/tx/${tx.hash}`} className="block p-2 rounded-md bg-muted hover:bg-muted/80 text-sm font-mono">
											{tx.hash}
										</Link>
									))}
									{block.transactions.length > 5 && (
										<Button variant="outline" asChild>
											<Link href={`/block/${block.height}/transactions`}>View all {block.transactions.length} transactions</Link>
										</Button>
									)}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">No transactions in this block</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
