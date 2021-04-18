import { NextApiRequest, NextApiResponse } from "next";

import { TickerInfo } from "./StructureTypes";

// Initializing the cors middleware
const headersConfig = {
	headers: {
		"Content-Type": "application/json",
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
		"sec-fetch-dest": "none",
		accept: "*/*",
		"sec-fetch-site": "cross-site",
		"sec-fetch-mode": "cors",
		"accept-language": "en-US"
	}
};

const fetchMostPopular = () => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/browse?productCategory=sneakers&sort=most-active&order=DESC`,
			headersConfig
		)
			.then((response) => response.json())
			.then((results) => {
				const tickers = results.Products.map(
					({ tickerSymbol, market }) => {
						return {
							ticker: tickerSymbol,
							latestChange:
								Math.round(market.changePercentage * 10000) /
								100
						} as TickerInfo;
					}
				);
				resolve({
					tickers
				});
			})
			.catch((err) => reject(err));
	});
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const data = await fetchMostPopular();
	res.json(data);
};

export default handler;
