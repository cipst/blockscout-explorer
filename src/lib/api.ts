// This file contains functions to interact with the Blockscout API

import type { BlockData, BlockDetailData, NetworkStatsData, TransactionData, TransactionDetailData, AddressDetailData } from "./types";

// Base URL for the Blockscout API
// You should replace this with the actual Blockscout API URL for your blockchain
const API_BASE_URL = "https://eth.blockscout.com/api";

// Fetch the latest blocks from the blockchain
export async function fetchLatestBlocks(): Promise<BlockData[]> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		const response = await fetch(`${API_BASE_URL}/v2/blocks`);
		const data = await response.json();

		console.log(` --- fetchLatestBlocks() ---`);
		console.log(data.items);

		return data.items;

		// Mock data for demonstration
		// return Array.from({ length: 10 }, (_, i) => ({
		// 	height: 18000000 - i,
		// 	hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		// 	timestamp: new Date(Date.now() - i * 15000).toISOString(),
		// 	txCount: Math.floor(Math.random() * 200) + 50,
		// 	gasUsed: (Math.floor(Math.random() * 15000000) + 5000000).toString(),
		// 	gasLimit: "30000000",
		// 	miner: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		// }));
	} catch (error) {
		console.error("Error fetching latest blocks:", error);
		throw error;
	}
}

// Fetch the latest transactions from the blockchain
export async function fetchLatestTransactions(): Promise<TransactionData[]> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		// const response = await fetch(`${API_BASE_URL}/v2/transactions`);
		// const data = await response.json();
		// return data.items;

		// Mock data for demonstration
		return Array.from({ length: 10 }, (_, i) => ({
			hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
			block_number: 18000000 - Math.floor(i / 2),
			timestamp: new Date(Date.now() - i * 12000).toISOString(),
			from: { hash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` },
			to: { hash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` },
			value: (Math.random() * 2).toFixed(4),
			fee: { type: "current", value: (Math.random() * 0.01).toFixed(6) },
		}));
	} catch (error) {
		console.error("Error fetching latest transactions:", error);
		throw error;
	}
}

// Fetch network statistics
export async function fetchNetworkStats(): Promise<NetworkStatsData> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		const response = await fetch(`${API_BASE_URL}/v2/stats`);
		const data = await response.json();
		console.log(" --- fetchNetworkStats() --- ");
		console.log(data);
		return data;

		// Mock data for demonstration
		// return {
		// 	totalBlocks: 18000000,
		// 	totalTransactions: 1500000000,
		// 	totalAddresses: 220000000,
		// 	gasPrice: 25,
		// 	blocksPerDay: 7200,
		// 	transactionsPerDay: 1200000,
		// 	newAddressesPerDay: 15000,
		// };
	} catch (error) {
		console.error("Error fetching network stats:", error);
		throw error;
	}
}

// Fetch details for a specific block
export async function fetchBlockDetails(blockId: string): Promise<BlockDetailData> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		const responseBlockDetails = await fetch(`${API_BASE_URL}/v2/blocks/${blockId}`);
		const responseBlockTransactions = await fetch(`${API_BASE_URL}/v2/blocks/${blockId}/transactions`);

		const blockDetails = (await responseBlockDetails.json()) as BlockDetailData;
		const blockTransactions = (await responseBlockTransactions.json()) as {
			items: TransactionData[];
			next_page_params: { block_number: number; index: number; items_count: number };
		};

		console.log(` --- fetchBlockDetails(${blockId}) ---`);
		console.log(blockDetails);
		console.log(blockTransactions.items);

		blockDetails.transactions = blockTransactions.items;

		return blockDetails;

		// Mock data for demonstration
		// const blockNumber = Number.parseInt(blockId);
		// return {
		// 	height: blockNumber,
		// 	hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		// 	parentHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		// 	timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
		// 	txCount: Math.floor(Math.random() * 200) + 50,
		// 	gasUsed: (Math.floor(Math.random() * 15000000) + 5000000).toString(),
		// 	gasLimit: "30000000",
		// 	miner: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		// 	transactions: Array.from(
		// 		{ length: Math.floor(Math.random() * 10) + 5 },
		// 		() => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
		// 	),
		// };
	} catch (error) {
		console.error(`Error fetching block details for block ${blockId}:`, error);
		throw error;
	}
}

// Fetch details for a specific transaction
export async function fetchTransactionDetails(txHash: string): Promise<TransactionDetailData> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		// const response = await fetch(`${API_BASE_URL}/v2/transactions/${txHash}`);
		// const data = await response.json();
		// return data;

		// Mock data for demonstration
		return {
			hash: txHash,
			block_number: 18000000 - Math.floor(Math.random() * 100),
			timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
			from: { hash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` },
			to: { hash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` },
			value: (Math.random() * 2).toFixed(4),
			fee: { type: "current", value: (Math.random() * 0.01).toFixed(6) },
			gasPrice: Math.floor(Math.random() * 50) + 10,
			gasLimit: (Math.floor(Math.random() * 100000) + 21000).toString(),
			gasUsed: (Math.floor(Math.random() * 100000) + 21000).toString(),
			nonce: Math.floor(Math.random() * 1000).toString(),
			status: Math.random() > 0.1, // 90% success rate
			input: Math.random() > 0.5 ? `0x${Array.from({ length: 200 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` : "0x",
		};
	} catch (error) {
		console.error(`Error fetching transaction details for tx ${txHash}:`, error);
		throw error;
	}
}

// Fetch details for a specific address
export async function fetchAddressDetails(address: string): Promise<AddressDetailData> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		// const response = await fetch(`${API_BASE_URL}/v2/addresses/${address}`);
		// const data = await response.json();
		// return data;

		// Mock data for demonstration
		return {
			address: address,
			balance: (Math.random() * 10).toFixed(4),
			txCount: Math.floor(Math.random() * 1000) + 10,
			tokens:
				Math.random() > 0.5
					? [
							{
								name: "USD Coin",
								symbol: "USDC",
								balance: (Math.random() * 10000).toFixed(2),
							},
							{
								name: "Tether",
								symbol: "USDT",
								balance: (Math.random() * 5000).toFixed(2),
							},
							{
								name: "Chainlink",
								symbol: "LINK",
								balance: (Math.random() * 100).toFixed(2),
							},
					  ]
					: [],
		};
	} catch (error) {
		console.error(`Error fetching address details for address ${address}:`, error);
		throw error;
	}
}

// Fetch transactions for a specific address
export async function fetchAddressTransactions(address: string): Promise<TransactionData[]> {
	try {
		// This is a mock implementation - in a real app, you would fetch from the actual API
		// const response = await fetch(`${API_BASE_URL}/v2/addresses/${address}/transactions`);
		// const data = await response.json();
		// return data.items;

		// Mock data for demonstration
		return Array.from({ length: 10 }, (_, i) => ({
			hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
			block_number: 18000000 - Math.floor(i / 2),
			timestamp: new Date(Date.now() - i * 86400000 * Math.random()).toISOString(),
			from: { hash: Math.random() > 0.5 ? address : `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` },
			to: { hash: Math.random() > 0.5 ? `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}` : address },
			value: (Math.random() * 2).toFixed(4),
			fee: { type: "current", value: (Math.random() * 0.01).toFixed(6) },
		}));
	} catch (error) {
		console.error(`Error fetching transactions for address ${address}:`, error);
		throw error;
	}
}
