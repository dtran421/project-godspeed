import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

import { headersConfig } from "../../_app";
import { ChildInfo, ShoeDetails } from "../StructureTypes";

const fetchShoe = async (
	urlKey: string
): Promise<{ details: ShoeDetails; children: Record<string, ChildInfo> }> => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/products/${urlKey}?includes=market&currency=USD`,
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
						condition,
						description,
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
						},
						children
					}
				}) => {
					const shoeChildren = {};
					for (const uuid of Object.keys(children)) {
						const {
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
						} = children[uuid];
						shoeChildren[uuid] = {
							uuid,
							size: shoeSize,
							latestPrice: {
								last: lastSale,
								ask: lowestAsk,
								bid: highestBid
							},
							latestChange: {
								dollar: changeValue,
								percent: changePercentage
							},
							ytdPrice: { high: annualHigh, low: annualLow },
							volatility,
							avgPrice: averageDeadstockPrice,
							sales: deadstockSold
						};
					}
					resolve({
						details: {
							name: title,
							urlKey,
							uuid,
							ticker: tickerSymbol,
							imageUrl,
							colorway,
							condition,
							description,
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
						},
						children: shoeChildren
					});
				}
			)
			.catch((err) => reject(err));
	});
};

const getShoeDetails = async (urlKey: string) => {
	let shoeDetails: ShoeDetails = null; /* cacheData.get(urlKey); */
	let shoeChildren: Record<string, ChildInfo> = null;
	if (!shoeDetails || !shoeChildren) {
		const FIVE_MINUTES = 1000 * 60 * 5;
		const shoeObject = await fetchShoe(urlKey);
		shoeDetails = shoeObject.details;
		shoeChildren = shoeObject.children;
		cacheData.put(`${urlKey}.details`, shoeDetails, FIVE_MINUTES);
		cacheData.put(`${urlKey}.children`, shoeChildren, FIVE_MINUTES);
	}
	return { details: shoeDetails, children: shoeChildren };
};

const fetchShoeData = (urlKey: string) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/products/${urlKey}/chart?start_date=all&end_date=2021-04-20&intervals=100&format=highstock&currency=USD&country=US`,
			headersConfig
		)
			.then((response) => response.json())
			.then(({ series }) => {
				resolve({
					data: series[0].data
				});
			})
			.catch((err) => reject(err));
	});
};

const getShoeData = async (urlKey: string) => {
	let shoeData = cacheData.get(urlKey);
	if (!shoeData) {
		const FIVE_MINUTES = 1000 * 60 * 5;
		shoeData = await fetchShoeData(urlKey);
		cacheData.put(`${urlKey}.data`, shoeData, FIVE_MINUTES);
	}
	return { data: shoeData.data };
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const [shoeObject, shoeData] = await Promise.all([
		getShoeDetails(req.query.urlKey as string),
		getShoeData(req.query.urlKey as string)
	]);
	res.json({
		details: shoeObject.details,
		children: shoeObject.children,
		data: shoeData.data
	});
};

export default handler;
