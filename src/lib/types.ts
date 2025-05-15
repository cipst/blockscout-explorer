// Types for the blockchain data

// Basic block data for listings
export interface BlockData {
	height: number;
	hash: string;
	timestamp: string;
	transaction_count: number;
	gas_used: string;
	gas_limit: string;
	miner: { hash: string };
}

// Detailed block data for single block view
export interface BlockDetailData extends BlockData {
	parent_hash: string;
	transactions: TransactionData[]; // Array of transaction hashes
}

// Basic transaction data for listings
export interface TransactionData {
	hash: string;
	block_number: number;
	timestamp: string;
	from: { hash: string };
	to: { hash: string };
	value: string;
	fee: { type: string; value: string };
}

// Detailed transaction data for single transaction view
export interface TransactionDetailData extends TransactionData {
	gasPrice: number;
	gasLimit: string;
	gasUsed: string;
	nonce: string;
	status: boolean;
	input: string;
}

// Network statistics
export interface NetworkStatsData {
	total_blocks: number;
	total_transactions: number;
	total_addresses: number;
	gas_prices: { slow: number; average: number; fast: number };
	// blocksPerDay: number;
	transactions_today: number;
}

// Token data
export interface TokenData {
	name: string;
	symbol: string;
	balance: string;
}

// Address data
export interface AddressDetailData {
	address: string;
	balance: string;
	txCount: number;
	tokens?: TokenData[];
}
