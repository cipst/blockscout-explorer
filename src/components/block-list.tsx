"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, CuboidIcon as Cube } from "lucide-react";

import { formatDistanceToNowStrict } from "date-fns";
import { fetchLatestBlocks } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BlockData } from "@/lib/types";

export function BlockList() {
	const [blocks, setBlocks] = useState<BlockData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getBlocks = async () => {
			try {
				const data = await fetchLatestBlocks();
				setBlocks(data);
			} catch (error) {
				console.error("Failed to fetch blocks:", error);
			} finally {
				setLoading(false);
			}
		};

		getBlocks();
		const interval = setInterval(getBlocks, 15000); // Refresh every 15 seconds
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
					<TableHead>Block</TableHead>
					<TableHead>Age</TableHead>
					<TableHead>Txn</TableHead>
					<TableHead>Gas Used</TableHead>
					<TableHead>Gas Limit</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{blocks.map((block) => (
					<TableRow key={block.height}>
						<TableCell className="font-medium">
							<Link href={`/block/${block.height}`} className="flex items-center text-primary hover:underline">
								<Cube className="mr-2 h-4 w-4" />
								{block.height}
							</Link>
						</TableCell>
						<TableCell>
							<div className="flex items-center text-muted-foreground">
								<Clock className="mr-2 h-4 w-4" />
								{formatDistanceToNowStrict(new Date(block.timestamp), { addSuffix: true })}
							</div>
						</TableCell>
						<TableCell>{block.transaction_count}</TableCell>
						<TableCell>{(Number(block.gas_used) / 1000000).toFixed(2)} M</TableCell>
						<TableCell>{(Number(block.gas_limit) / 1000000).toFixed(2)} M</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
