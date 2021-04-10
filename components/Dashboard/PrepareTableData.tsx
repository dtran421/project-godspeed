import { CardInfo } from "./WatchlistDisplay";

const prepareTableData = (
	shoeInfos: { [id: string]: CardInfo },
	activeList: Record<string, unknown>[]
): Record<string, string>[] => {
	const tableData = [];
	activeList.map((shoe) => {
		const shoeInfo = shoeInfos[shoe.id as string];
		tableData.push({
			image: shoeInfo.imageUrl,
			product: {
				name: shoe.name,
				shoeInfo: shoeInfo
			},
			latestPrice: {
				latestPrice: shoeInfo.latestPrice.last,
				latestChange: shoeInfo.latestChange.percent
			},
			retailPrice: `$${shoeInfo.retailPrice}`,
			lowestAsk: `$${shoeInfo.latestPrice.ask}`,
			highestBid: `$${shoeInfo.latestPrice.bid}`,
			ytdGain: {
				ytdGain: shoeInfo.latestPrice.last,
				retailPrice: shoeInfo.retailPrice
			},
			ytdHigh: `$${shoeInfo.ytdPrice.high}`,
			ytdLow: `$${shoeInfo.ytdPrice.low}`,
			volatility: `${shoeInfo.volatility}%`,
			meanPrice: `$${shoeInfo.meanPrice}`,
			totalSales: shoeInfo.sales
		});
	});
	return tableData;
};

export default prepareTableData;
