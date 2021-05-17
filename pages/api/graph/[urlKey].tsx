import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

import { headersConfig } from "../../_app";

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
	let shoeData = cacheData.get(`${urlKey}.data`);
	if (!shoeData) {
		const FIFTEEN_MINUTES = 1000 * 60 * 15;
		shoeData = await fetchShoeData(urlKey);
		cacheData.put(`${urlKey}.data`, shoeData, FIFTEEN_MINUTES);
	}
	return { data: shoeData.data };
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const data = await getShoeData(req.query.urlKey as string);
	res.json(data);
};

export default handler;
