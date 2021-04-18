import { NextApiRequest, NextApiResponse } from "next";

import { ReleaseInfo } from "./StructureTypes";

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
const fetchNewReleases = () => {
	const time = Math.floor(new Date().getTime() / 1000);
	return new Promise((resolve, reject) => {
		fetch(
			`https://stockx.com/api/browse?productCategory=sneakers&sort=release_date&order=ASC&releaseTime=gte-${time}`,
			headersConfig
		)
			.then((response) => response.json())
			.then((results) => {
				const releaseDates = [];
				const top3 = [];
				const newReleases = [];
				const releaseInfos = {};
				results.Products.forEach(
					(
						{
							urlKey,
							uuid,
							title,
							tickerSymbol,
							media,
							releaseDate,
							retailPrice,
							market
						},
						index
					) => {
						const releaseInfo: ReleaseInfo = {
							urlKey: urlKey,
							uuid: uuid,
							name: title,
							ticker: tickerSymbol,
							imageUrl: media.imageUrl,
							releaseDate: releaseDate,
							prices: {
								retail: retailPrice,
								ask: market.lowestAsk,
								bid: market.highestBid
							}
						};
						if (index < 3) {
							top3.push(urlKey);
						} else {
							if (!releaseDates.includes(releaseDate)) {
								releaseDates.push(releaseDate);
							}
							newReleases.push(urlKey);
						}
						releaseInfos[urlKey] = releaseInfo;
					}
				);
				resolve({
					releaseDates,
					top3,
					newReleases,
					releaseInfos
				});
			})
			.catch((err) => reject(err));
	});
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const data = await fetchNewReleases();
	res.json(data);
};

export default handler;
