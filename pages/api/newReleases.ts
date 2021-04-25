import { NextApiRequest, NextApiResponse } from "next";
import cacheData from "memory-cache";

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

export const MAX_SHOES_PER_LINE = 4;

const makeFetchRequest = async (
	time: number,
	page: number,
	top3: ReleaseInfo[],
	newReleases
) => {
	let currMonth = "";
	await fetch(
		`https://stockx.com/api/browse?order=ASC&productCategory=sneakers&releaseTime=gte-${time}&sort=release_date&page=${page}`,
		headersConfig
	)
		.then((response) => response.json())
		.then(async ({ Pagination: { nextPage }, Products: products }) => {
			let monthReleases = {};
			products.forEach(
				({
					urlKey,
					uuid,
					title,
					tickerSymbol,
					media: { imageUrl },
					releaseDate,
					retailPrice,
					market: { lowestAsk, highestBid }
				}) => {
					const releaseInfo: ReleaseInfo = {
						urlKey,
						uuid,
						name: title,
						ticker: tickerSymbol,
						imageUrl,
						releaseDate,
						prices: {
							retail: retailPrice,
							ask: lowestAsk,
							bid: highestBid
						}
					};
					if (top3.length < 3) {
						top3.push(releaseInfo);
					} else {
						const month = releaseDate.split("-")[1];
						if (currMonth === "") {
							currMonth = month;
						}
						if (releaseDate in monthReleases) {
							monthReleases[releaseDate] = [
								...monthReleases[releaseDate],
								releaseInfo
							];
						} else {
							if (currMonth !== month) {
								currMonth = (parseInt(currMonth) + 1)
									.toString()
									.padStart(2, "0");
								monthReleases = {};
							}
							monthReleases[releaseDate] = [releaseInfo];
						}
						newReleases[currMonth] = monthReleases;
					}
				}
			);
			if (nextPage !== null) {
				await makeFetchRequest(time, ++page, top3, newReleases);
			}
		})
		.catch((err) => console.log(err));
};

const fetchNewReleases = async () => {
	const time = Math.floor(new Date().getTime() / 1000);
	const top3 = [];
	const newReleases = {};
	await makeFetchRequest(time, 1, top3, newReleases);
	return { top3, newReleases };
};

const getPagination = async (month: string) => {
	let newReleasesData = cacheData.get("newReleasesData");
	if (!newReleasesData) {
		const FIFTEEN_MINUTES = 1000 * 60 * 15;
		newReleasesData = await fetchNewReleases();
		cacheData.put("newReleasesData", newReleasesData, FIFTEEN_MINUTES);
	}
	const { top3, newReleases } = newReleasesData;

	const releaseMonths = Object.keys(newReleases).sort();
	let index = releaseMonths.indexOf(month);
	if (index === -1) {
		const tempMonth = parseInt(month);
		const firstMonth = releaseMonths[0];
		const lastMonth = releaseMonths[releaseMonths.length - 1];
		if (tempMonth < parseInt(firstMonth)) {
			month = firstMonth;
			index = 0;
		} else if (tempMonth > parseInt(lastMonth)) {
			month = lastMonth;
			index = releaseMonths.length - 1;
		} else {
			let compMonth = firstMonth;
			let tempIndex = 0;
			while (parseInt(compMonth) < tempMonth) {
				compMonth = releaseMonths[++tempIndex];
			}
			month = compMonth;
			index = tempIndex;
		}
	}
	return {
		top3,
		newReleases: newReleases[month],
		month: {
			current: month,
			index
		},
		releaseMonths
	};
};

const handler = async (
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> => {
	const test = await getPagination(req.query.month as string);
	res.json(test);
};

export default handler;
