import { NextApiRequest, NextApiResponse } from "next";

import { headersConfig } from "../_app";

export const MAX_SHOES_PER_LINE = 4;

const searchRequest = async (query: string, page: string) => {
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/browse?productCategory=sneakers&_search=${query}&dataType=product${
				page !== "" && `&page=${page}`
			}`,
			headersConfig
		)
			.then((response) => response.json())
			.then(
				async ({
					Pagination: { limit, total },
					Products: products
				}) => {
					const shoes = products.map(
						({
							urlKey,
							uuid,
							title,
							tickerSymbol,
							media: { imageUrl },
							market: { lastSale: last }
						}) => {
							return {
								urlKey,
								uuid,
								name: title,
								ticker: tickerSymbol,
								imageUrl,
								latestPrice: last
							};
						}
					);
					let pages = Math.ceil(total / limit);
					let overflow = false;
					if (pages > 50) {
						pages = 50;
						total = 1000;
						overflow = true;
					}
					resolve({
						shoes,
						results: total,
						pages,
						overflow
					});
				}
			)
			.catch((err) => reject(err));
	});
};

const options = {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"x-algolia-application-id": "XW7SBCT9V6",
		"x-algolia-api-key":
			"ODE2NDI5NzliOTM5N2Q2YjU0ZGYzMjk4MWRiMWY1M2ZhYTkwOGIzMjEzMzFjY2NlZjY4OGMzZjQ4M2MzMmY5ZXZhbGlkVW50aWw9MTYyMDI3ODUwMQ==",
		"Accept-Language": "en-US,en;q=0.9",
		Origin: "https://stockx.com",
		Accept: "*/*"
	},
	body: JSON.stringify({
		query: "jordan",
		facets: "*",
		filters: ""
	})
};

/* const test = async () => {
	fetch(
		"https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser",
		options
	)
		.then((response) => response.json())
		.then((results) => {
			console.log(results);
		});
}; */

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const results = await searchRequest(
		req.query.query as string,
		req.query.page as string
	);
	res.json(results);
};

export default handler;
