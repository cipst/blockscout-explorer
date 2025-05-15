"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Zap } from "lucide-react";

import { fetchNetworkStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NetworkStatsData } from "@/lib/types";

export function NetworkStats() {
	const [stats, setStats] = useState<NetworkStatsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getStats = async () => {
			try {
				const data = await fetchNetworkStats();
				setStats(data);
			} catch (error) {
				console.error("Failed to fetch network stats:", error);
			} finally {
				setLoading(false);
			}
		};

		getStats();
		// const interval = setInterval(getStats, 30000); // Refresh every 30 seconds
		// return () => clearInterval(interval);
	}, []);

	if (loading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<Skeleton className="h-4 w-[100px]" />
							</CardTitle>
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-[120px]" />
							<Skeleton className="h-4 w-[150px] mt-2" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
					<Cpu className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{Number(stats?.total_blocks).toLocaleString()}</div>
					{/* <p className="text-xs text-muted-foreground">+{stats?.blocksPerDay} blocks in the last 24h</p> */}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
					<Activity className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{Number(stats?.total_transactions).toLocaleString()}</div>
					<p className="text-xs text-muted-foreground">+{Number(stats?.transactions_today).toLocaleString()} txns in the last 24h</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Gas Price</CardTitle>
					<Zap className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats?.gas_prices.average} Gwei</div>
					<p className="text-xs text-muted-foreground">Average gas price</p>
				</CardContent>
			</Card>
			{/* <Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Addresses</CardTitle>
					<Database className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats?.total_addresses.toLocaleString()}</div>
					<p className="text-xs text-muted-foreground">+{stats?.newAddressesPerDay} new addresses in the last 24h</p>
				</CardContent>
			</Card> */}
		</div>
	);
}
