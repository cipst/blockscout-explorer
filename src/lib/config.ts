export const API_CONFIG = {
	CHAINS_API: {
		BASE_URL: "https://chains.blockscout.com/api",
		ENDPOINTS: {
			CHAIN: (chainId: string) => `/chains/${chainId}`,
		},
	},
	EXPLORER_API: {
		BASE_URL: "https://eth.blockscout.com",
		ENDPOINTS: {
			TRANSACTION: (hash: string) => `/api/v2/transactions/${hash}`,
			TRANSACTION_SUMMARY: (hash: string) => `/api/v2/transactions/${hash}/summary`,
			BLOCKS: () => `/api/v2/blocks`,
		},
	},
} as const;

export const APP_CONFIG = {
	URLS: {
		TRANSACTION: (hash: string) => `/tx/${hash}`,
		ADDRESS: (hash: string) => `/address/${hash}`,
		TOKEN: (hash: string) => `/token/${hash}`,
		ENVS: "/node-api/config",
	},
} as const;
