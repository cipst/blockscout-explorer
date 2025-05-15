"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowLeftRight, Banknote, Clock, Copy, FileText, User } from "lucide-react";

import { fetchAddressDetails, fetchAddressTransactions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import type { AddressDetailData, TransactionData } from "@/lib/types";

export default function AddressDetailPage() {
	const { address } = useParams();
	const [addressData, setAddressData] = useState<AddressDetailData | null>(null);
	const [transactions, setTransactions] = useState<TransactionData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getAddressDetails = async () => {
			try {
				const data = await fetchAddressDetails(address as string);
				setAddressData(data);

				const txData = await fetchAddressTransactions(address as string);
				setTransactions(txData);
			} catch (error) {
				console.error("Failed to fetch address details:", error);
			} finally {
				setLoading(false);
			}
		};

		if (address) {
			getAddressDetails();
		}
	}, [address]);

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(address as string)
			.then(() => {
				alert("Address copied to clipboard");
			})
			.catch((err) => {
				console.error("Failed to copy address:", err);
			});
	};

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
							{Array.from({ length: 4 }).map((_, i) => (
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

	if (!addressData) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col gap-8">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button variant="outline" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<h1 className="text-3xl font-bold">Address Not Found</h1>
					</div>
					<Card>
						<CardContent className="py-8">
							<p className="text-center text-muted-foreground">The requested address could not be found.</p>
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
					<h1 className="text-3xl font-bold">Address</h1>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Address
						</CardTitle>
						<div className="flex items-center gap-2">
							<CardDescription className="font-mono text-xs break-all">{address as string}</CardDescription>
							<Button variant="ghost" size="icon" onClick={copyToClipboard}>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Balance</p>
								<div className="flex items-center gap-2">
									<Banknote className="h-4 w-4 text-muted-foreground" />
									<p className="text-lg font-semibold">{addressData.balance} ETH</p>
								</div>
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">Transactions</p>
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-muted-foreground" />
									<p>{addressData.txCount} transactions</p>
								</div>
							</div>
						</div>

						<Separator />

						<Tabs defaultValue="transactions">
							<TabsList>
								<TabsTrigger value="transactions">Transactions</TabsTrigger>
								<TabsTrigger value="tokens">Tokens</TabsTrigger>
							</TabsList>
							<TabsContent value="transactions" className="mt-4">
								{transactions.length > 0 ? (
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
														{tx.from === address ? (
															<span className="font-semibold">OUT</span>
														) : (
															<Link href={`/address/${tx.from}`} className="text-primary hover:underline">
																{tx.from.substring(0, 8)}...
															</Link>
														)}
													</TableCell>
													<TableCell>
														{tx.to === address ? (
															<span className="font-semibold">IN</span>
														) : (
															<Link href={`/address/${tx.to}`} className="text-primary hover:underline">
																{tx.to.substring(0, 8)}...
															</Link>
														)}
													</TableCell>
													<TableCell>{tx.value} ETH</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<p className="text-center text-muted-foreground py-4">No transactions found</p>
								)}
							</TabsContent>
							<TabsContent value="tokens" className="mt-4">
								{addressData.tokens && addressData.tokens.length > 0 ? (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Token</TableHead>
												<TableHead>Balance</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{addressData.tokens.map((token, index) => (
												<TableRow key={index}>
													<TableCell>
														{token.name} ({token.symbol})
													</TableCell>
													<TableCell>{token.balance}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<p className="text-center text-muted-foreground py-4">No tokens found</p>
								)}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
