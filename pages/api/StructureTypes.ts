export interface CardInfo {
	name: string;
	urlKey: string;
	uuid: string;
	ticker: string;
	imageUrl: string;
	colorway: string;
	releaseDate: string;
	retailPrice: number;
	latestPrice: {
		last: number;
		ask: number;
		bid: number;
	};
	latestChange: {
		dollar: number;
		percent: number;
	};
	ytdPrice: {
		high: number;
		low: number;
	};
	volatility: number;
	avgPrice: number;
	sales: number;
}

export interface ShoeInfo {
	[urlKey: string]: CardInfo;
}

export interface ChildInfo {
	uuid: string;
	shoeSize: string;
	latestPrice: {
		last: number;
		ask: number;
		bid: number;
	};
	latestChange: {
		dollar: number;
		percent: number;
	};
	ytdPrice: {
		high: number;
		low: number;
	};
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

export interface TickerInfo {
	ticker: string;
	latestChange: number;
}

export interface ShowcaseInfo {
	name: string;
	uuid: string;
	urlKey: string;
	imageUrl: string;
	ticker: string;
	latestPrice: number;
	latestChange: number;
}
