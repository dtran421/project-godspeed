import { NextApiRequest, NextApiResponse } from "next";

import { ShowcaseInfo } from "./StructureTypes";
import { headersConfig } from "../_app";

export const MAX_SHOES_PER_SHOWCASE = 20;

const fetchMostPopular = () => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/browse?productCategory=sneakers`,
			headersConfig
		)
			.then((response) => response.json())
			.then((results) => {
				const mostPopular = results.Products.reduce(
					(
						result,
						{
							title,
							uuid,
							urlKey,
							media: { imageUrl },
							tickerSymbol,
							market: { lastSale, changePercentage }
						},
						index
					) => {
						if (index < MAX_SHOES_PER_SHOWCASE) {
							result.push({
								name: title,
								uuid,
								urlKey,
								imageUrl,
								ticker: tickerSymbol,
								latestPrice: lastSale,
								latestChange: changePercentage
							} as ShowcaseInfo);
						}
						return result;
					},
					[]
				);
				resolve({
					mostPopular
				});
			})
			.catch((err) => reject(err));
	});
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const data = await fetchMostPopular();
	res.json(data);
};

export default handler;
