import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

import { headersConfig } from "../../_app";

const fetchShoeSales = (uuid: string) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/products/${uuid}/activity?state=480&currency=USD&limit=20&page=1&sort=createdAt&order=DESC&country=US`,
			headersConfig
		)
			.then((response) => response.json())
			.then(({ ProductActivity }) => {
				const shoeSales = ProductActivity.map(
					({ createdAt, shoeSize, amount }) => {
						return {
							createdAt,
							shoeSize,
							amount
						};
					}
				);
				resolve({
					shoeSales
				});
			})
			.catch((err) => reject(err));
	});
};

const getShoeSales = async (uuid: string) => {
	let shoeSales = cacheData.get(`${uuid}.sales`);
	if (!shoeSales) {
		const FIFTEEN_MINUTES = 1000 * 60 * 15;
		shoeSales = await fetchShoeSales(uuid);
		cacheData.put(`${uuid}.sales`, shoeSales, FIFTEEN_MINUTES);
	}
	return { shoeSales };
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const data = await getShoeSales(req.query.uuid as string);
	res.json(data);
};

export default handler;
