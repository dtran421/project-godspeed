import { NextApiRequest, NextApiResponse } from "next";

import { headersConfig } from "../../_app";
import { ChildInfo } from "../StructureTypes";

const fetchShoes = (uuid: string) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/products/${uuid}?includes=market&currency=USD`,
			headersConfig
		)
			.then((response) => response.json())
			.then(({ Product: { children } }) => {
				const shoeChildren = Object.keys(children).map((childUuid) => {
					const {
						uuid,
						shoeSize,
						market: {
							lastSale,
							lowestAsk,
							highestBid,
							changeValue,
							changePercentage,
							annualHigh,
							annualLow,
							volatility,
							averageDeadstockPrice,
							deadstockSold
						}
					} = children[childUuid];
					return {
						uuid,
						shoeSize,
						latestPrice: {
							last: lastSale,
							ask: lowestAsk,
							bid: highestBid
						},
						latestChange: {
							dollar: changeValue,
							percent: changePercentage
						},
						ytdPrice: {
							high: annualHigh,
							low: annualLow
						},
						volatility,
						avgPrice: averageDeadstockPrice,
						sales: deadstockSold
					} as ChildInfo;
				});
				resolve(shoeChildren);
			})
			.catch((err) => reject(err));
	});
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const data = await fetchShoes(req.query.uuid as string);
	res.json(data);
};

export default handler;
