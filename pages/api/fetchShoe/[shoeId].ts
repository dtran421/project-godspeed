import { NextApiRequest, NextApiResponse } from "next";

import { CardInfo } from "../StructureTypes";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchShoes = (req, res) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/products/${req.query.shoeId}?includes=market&currency=USD`,
			headersConfig
		)
			.then((response) => response.json())
			.then((product) => {
				const productData = product.Product;
				const marketData = productData.market;
				resolve({
					name: productData.title,
					ticker: productData.tickerSymbol,
					imageUrl: productData.media.imageUrl,
					colorway: productData.colorway,
					releaseDate: productData.releaseDate,
					retailPrice: productData.retailPrice,
					latestPrice: {
						market: marketData.lastSale,
						ask: marketData.lowestAsk,
						bid: marketData.highestBid
					},
					latestChange: {
						dollar: marketData.changeValue,
						percent: marketData.changePercentage
					},
					ytdPrice: {
						high: marketData.annualHigh,
						low: marketData.annualLow
					},
					volatility: marketData.volatility,
					avgPrice: marketData.averageDeadstockPrice,
					sales: marketData.deadstockSold
				} as CardInfo);
			})
			.catch((err) => reject(err));
	});
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const data = await fetchShoes(req, res);
	res.json(data);
};

export default handler;
