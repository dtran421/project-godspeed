import { Dispatch, SetStateAction } from "react";

/* General shoe info (dashboard) */
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

export interface WatchlistData {
	shoes: Record<string, ShoeChild[]>;
	created: Date;
}

export interface ShoeInfos {
	[urlKey: string]: CardInfo;
}

/* Shoe child info */
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

export interface ShoeChild {
	size: string;
	uuid: string;
}

/* Release info (index, drops) */
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

/* Misc types for index */
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

export interface AddShoe {
	shoe: string;
	children: ShoeChild[];
}

/* Shoe page info */
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

/* News story info (news) */
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

/* Search info (search) */
export interface SearchInfo {
	urlKey: string;
	uuid: string;
	name: string;
	ticker: string;
	imageUrl: string;
	latestPrice: number;
}

/* User info (settings) */
export interface UserInfo {
	name: string;
	email: string;
}

/* Modal types */
export interface ModalContextObject {
	watchlistsContext: [
		boolean,
		boolean,
		{ value: string; label: string }[],
		Dispatch<
			SetStateAction<
				[boolean, boolean, { value: string; label: string }[]]
			>
		>
	];
}
