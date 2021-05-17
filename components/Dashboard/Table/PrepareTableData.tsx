import { Dispatch, SetStateAction } from "react";

import {
	ShoeInfos,
	ChildInfo,
	ShoeChild
} from "../../../pages/api/StructureTypes";
import { months } from "../../../pages/drops";
import {
	imageCell,
	productCell,
	statCell,
	specialPriceCell,
	specialGainCell,
	actionCell,
	expanderHeader,
	expanderCell
} from "./Cells";

export const DashboardTableColumns = (
	mode: string,
	updateGraphShoe: Dispatch<SetStateAction<string[]>>,
	deleteShoe: (shoeId: string) => void
): Record<string, string | boolean | number | ((any) => void)>[] => [
	{
		Header: "",
		accessor: "imageUrl",
		Cell: ({ value: imageUrl }) => imageCell({ imageUrl })
	},
	{
		Header: "Product",
		accessor: "product",
		width: 200,
		Cell: ({ value: { name, ticker, size } }) =>
			productCell({ mode, name, ticker, size })
	},
	{
		Header: "Retail Price",
		accessor: "retailPrice",
		Cell: ({ value: retailPrice }) =>
			statCell({ stat: retailPrice, format: "dollar" })
	},
	{
		Header: "Last Price",
		accessor: "latestPrice",
		Cell: ({ value: { latestPrice, latestChange } }) =>
			specialPriceCell({ latestPrice, latestChange })
	},
	{
		Header: "Total Gain",
		accessor: "totalGain",
		Cell: ({ value: { lastPrice, retailPrice } }) =>
			specialGainCell({ lastPrice, retailPrice })
	},
	{
		Header: "Lowest Ask",
		accessor: "lowestAsk",
		Cell: ({ value: lowestAsk }) =>
			statCell({ stat: lowestAsk, format: "dollar" })
	},
	{
		Header: "Highest Bid",
		accessor: "highestBid",
		Cell: ({ value: highestBid }) =>
			statCell({ stat: highestBid, format: "dollar" })
	},
	{
		Header: "52 Week High",
		accessor: "ytdHigh",
		isVisible: false,
		Cell: ({ value: ytdHigh }) =>
			statCell({ stat: ytdHigh, format: "dollar" })
	},
	{
		Header: "52 Week Low",
		accessor: "ytdLow",
		Cell: ({ value: ytdLow }) =>
			statCell({ stat: ytdLow, format: "dollar" })
	},
	{
		Header: "Volatility",
		accessor: "volatility",
		Cell: ({ value: volatility }) =>
			statCell({ stat: volatility, format: "percent" })
	},
	{
		Header: "Average Price",
		accessor: "avgPrice",
		Cell: ({ value: avgPrice }) =>
			statCell({ stat: avgPrice, format: "dollar" })
	},
	{
		Header: "Total Sales",
		accessor: "totalSales",
		Cell: ({ value: totalSales }) =>
			statCell({ stat: totalSales, format: "number" })
	},
	{
		Header: "",
		accessor: "action",
		Cell: ({ value: { child, shoeId, name } }) =>
			actionCell({
				child,
				shoeId,
				name,
				updateGraphShoe,
				deleteShoe
			})
	},
	{
		id: "expander",
		Header: (props) => expanderHeader(props),
		Cell: (props) => expanderCell(props)
	}
];

export const prepareDashboardTable = (
	shoeInfos: ShoeInfos,
	newChildrenInfos: Record<string, ChildInfo>,
	activeShoes: string[],
	shoeChildren: Record<string, ShoeChild[]>
): Record<string, string | number>[] => {
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
		const subRows = shoeChildren[urlKey].map(({ uuid, size }) => {
			const {
				latestPrice: { last, ask, bid },
				latestChange: { percent },
				ytdPrice: { high, low },
				volatility,
				avgPrice,
				sales
			} = newChildrenInfos[uuid];
			return {
				imageUrl: "",
				product: {
					size
				},
				latestPrice: {
					latestPrice: last,
					latestChange: formatDecimal(percent, 2)
				},
				retailPrice,
				lowestAsk: ask,
				highestBid: bid,
				totalGain: {
					lastPrice: last,
					retailPrice
				},
				ytdHigh: high,
				ytdLow: low,
				volatility: formatDecimal(volatility, 2),
				avgPrice,
				totalSales: sales,
				action: {
					child: true,
					shoeId: uuid,
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
			retailPrice,
			lowestAsk: ask,
			highestBid: bid,
			totalGain: {
				lastPrice: last,
				retailPrice
			},
			ytdHigh: high,
			ytdLow: low,
			volatility: formatDecimal(volatility, 2),
			avgPrice,
			totalSales: sales,
			action: {
				shoeId: urlKey,
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

export const SalesTableColumns: Record<
	string,
	string | number | ((any) => void)
>[] = [
	{
		Header: "Date",
		accessor: "date",
		Cell: ({ value }) => value
	},
	{
		Header: "Time",
		accessor: "time",
		Cell: ({ value }) => value
	},
	{
		Header: "Size",
		accessor: "shoeSize",
		Cell: ({ value }) => value
	},
	{
		Header: "Sale Price",
		accessor: "amount",
		Cell: ({ value }) => value
	},
	{
		Header: "Profit/Loss",
		accessor: "profit",
		Cell: ({ value }) => value
	}
];

export const prepareSalesTable = (
	retailPrice: number,
	salesData: Record<string, string | number>[]
): Record<string, string | number>[] => {
	const tableData = [];
	salesData.map(({ createdAt, shoeSize, amount }, index) => {
		if (index < 10) {
			const saleDate = new Date(createdAt);
			const hours = saleDate.getHours();

			const profit = Math.round(amount as number) - retailPrice;
			tableData.push({
				date: `${
					months[
						(saleDate.getMonth() + 1).toString().padStart(2, "0")
					]
				} ${saleDate.getDate()}, ${saleDate.getFullYear()}`,
				time: `${
					hours >= 12 ? hours - 12 : hours
				}:${saleDate.getMinutes().toString().padStart(2, "0")} ${
					hours >= 12 ? "PM" : "AM"
				}`,
				shoeSize,
				amount: `$${Math.round(amount as number)}`,
				profit: `$${profit} (${
					Math.round((profit / retailPrice) * 10000) / 100
				}%)`
			});
		}
	});
	return tableData;
};
