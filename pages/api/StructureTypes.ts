export interface CardInfo {
	name: string;
	urlKey: string;
	uuid: string;
	ticker: string;
	imageUrl: string;
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

export interface ShoeInfos {
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

export interface ChildInfos {
	[uuid: string]: ChildInfo;
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
	urlKey: string;
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

export interface ShoeChild {
	size: string;
	uuid: string;
}

export interface ShoeDetails {
	name: string;
	urlKey: string;
	uuid: string;
	ticker: string;
	imageUrl: string;
	colorway: string;
	condition: string;
	description;
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

export interface PopularStoryInfo {
	headline: string;
	link: string;
	imageUrl: string;
}

export interface StoryInfo {
	headline: string;
	link: string;
	postTime: string;
	imageUrl: string;
}

export interface SearchInfo {
	urlKey: string;
	uuid: string;
	name: string;
	ticker: string;
	imageUrl: string;
	latestPrice: number;
}
