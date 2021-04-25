import { ShoeInfo } from "../../../pages/api/StructureTypes";

const prepareTableData = (
	shoeInfos: ShoeInfo,
	activeShoes: string[],
	shoeChildren: Record<string, string[]>
): Record<string, string>[] => {
	if (Object.keys(shoeInfos).length === 0) return [];
	const tableData = [];
	activeShoes.map((urlKey: string) => {
		const {
			name,
			ticker,
			imageUrl,
			retailPrice,
			latestPrice: { last, ask, bid },
			latestChange: { percent },
			ytdPrice: { high, low },
			volatility,
			avgPrice,
			sales
		} = shoeInfos[urlKey];
		const subRows = shoeChildren[urlKey].map((size) => {
			return {
				imageUrl: "",
				product: {
					size
				},
				latestPrice: {
					latestPrice: last,
					latestChange: formatDecimal(percent, 2)
				},
				retailPrice: `$${retailPrice}`,
				lowestAsk: `$${ask}`,
				highestBid: `$${bid}`,
				totalGain: {
					lastPrice: last,
					retailPrice
				},
				ytdHigh: `$${high}`,
				ytdLow: `$${low}`,
				volatility: `${formatDecimal(volatility, 2)}%`,
				avgPrice: `$${avgPrice}`,
				totalSales: sales,
				action: {
					child: true,
					urlKey,
					name
				}
			};
		});
		tableData.push({
			imageUrl,
			product: {
				name,
				ticker
			},
			latestPrice: {
				latestPrice: last,
				latestChange: formatDecimal(percent, 2)
			},
			retailPrice: `$${retailPrice}`,
			lowestAsk: `$${ask}`,
			highestBid: `$${bid}`,
			totalGain: {
				lastPrice: last,
				retailPrice
			},
			ytdHigh: `$${high}`,
			ytdLow: `$${low}`,
			volatility: `${formatDecimal(volatility, 2)}%`,
			avgPrice: `$${avgPrice}`,
			totalSales: sales,
			action: {
				urlKey,
				name
			},
			subRows
		});
	});
	return tableData;
};

const formatDecimal = (dec, places): number => {
	return Math.round(dec * 10000) / Math.pow(10, places);
};

export default prepareTableData;
