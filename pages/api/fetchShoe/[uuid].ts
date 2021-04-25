import { NextApiRequest, NextApiResponse } from "next";

import { headersConfig } from "../../_app";
import { CardInfo } from "../StructureTypes";

const fetchShoes = (uuid: string) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/products/${uuid}?includes=market&currency=USD`,
			headersConfig
		)
			.then((response) => response.json())
			.then(
				({
					Product: {
						title,
						urlKey,
						uuid,
						tickerSymbol,
						media: { imageUrl },
						colorway,
						releaseDate,
						retailPrice,
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
					}
				}) => {
					resolve({
						name: title,
						urlKey,
						uuid,
						ticker: tickerSymbol,
						imageUrl,
						colorway,
						releaseDate,
						retailPrice,
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
					} as CardInfo);
				}
			)
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
