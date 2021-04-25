import { NextApiRequest, NextApiResponse } from "next";

import { ShowcaseInfo } from "./StructureTypes";
import { headersConfig } from "../_app";
import { MAX_SHOES_PER_SHOWCASE } from "./trending";

const fetchMostPopular = () => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/browse?productCategory=sneakers&sort=price_premium&order=DESC`,
			headersConfig
		)
			.then((response) => response.json())
			.then((results) => {
				const highestGainers = results.Products.reduce(
					(
						result,
						{
							title,
							uuid,
							urlKey,
							media: { imageUrl },
							tickerSymbol,
							retailPrice,
							market: { lastSale }
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
								latestChange:
									(lastSale - retailPrice) / retailPrice
							} as ShowcaseInfo);
						}
						return result;
					},
					[]
				);
				resolve({
					highestGainers
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
