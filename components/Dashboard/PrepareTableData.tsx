import { CardInfo } from "../../pages/api/StructureTypes";

const prepareTableData = (
	shoeInfos: { [id: string]: CardInfo },
	activeList: string[]
): Record<string, string>[] => {
	if (Object.keys(shoeInfos).length === 0) return [];
	const tableData = [];
	activeList.map((shoeId) => {
		const shoeInfo = shoeInfos[shoeId as string];
		tableData.push({
			image: shoeInfo.imageUrl,
			product: shoeInfo,
			latestPrice: {
				latestPrice: shoeInfo.latestPrice.market,
				latestChange: formatDecimal(shoeInfo.latestChange.percent, 2)
			},
			retailPrice: `$${shoeInfo.retailPrice}`,
			lowestAsk: `$${shoeInfo.latestPrice.ask}`,
			highestBid: `$${shoeInfo.latestPrice.bid}`,
			ytdGain: {
				ytdGain: shoeInfo.latestPrice.market,
				retailPrice: shoeInfo.retailPrice
			},
			ytdHigh: `$${shoeInfo.ytdPrice.high}`,
			ytdLow: `$${shoeInfo.ytdPrice.low}`,
			volatility: `${formatDecimal(shoeInfo.volatility, 2)}%`,
			avgPrice: `$${shoeInfo.avgPrice}`,
			totalSales: shoeInfo.sales
		});
	});
	return tableData;
};

const formatDecimal = (dec, places): number => {
	return Math.round(dec * 10000) / Math.pow(10, places);
};

export default prepareTableData;
