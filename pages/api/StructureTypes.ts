export interface CardInfo {
	name: string;
	ticker: string;
	imageUrl: string;
	colorway: string;
	releaseDate: string;
	retailPrice: number;
	latestPrice: Record<string, number>;
	latestChange: Record<string, number>;
	ytdPrice: Record<string, number>;
	volatility: number;
	avgPrice: number;
	sales: number;
}

export interface ReleaseInfo {
	urlKey: string;
	uuid: string;
	name: string;
	ticker: string;
	imageUrl: string;
	releaseDate: string;
	prices: {
		retail: number;
		ask: number;
		bid: number;
	};
}
