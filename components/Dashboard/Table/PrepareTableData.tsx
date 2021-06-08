import { Dispatch, SetStateAction } from "react";

import {
	ShoeInfos,
	ChildInfo,
	ShoeChild
} from "../../../pages/api/StructureTypes";
import { months } from "../../../pages/drops";
import {
	ImageCell,
	ProductCell,
	StatCell,
	SpecialPriceCell,
	SpecialGainCell,
	ActionCell,
	expanderHeader,
	expanderCell
} from "./Cells";

export const DashboardTableColumns = (
	mode: string,
	updateGraphShoe: Dispatch<SetStateAction<[string, string, number[]]>>,
	deleteShoe: (shoeId: string, child: boolean, parent: string) => void
): Record<string, string | boolean | number | ((any) => void)>[] => [
	{
		Header: "Image",
		accessor: "imageUrl",
		width: 200,
		Cell: ({ value: imageUrl }) => ImageCell({ imageUrl })
	},
	{
		Header: "Product",
		accessor: "product",
		width: 200,
		Cell: ({ value: { name, ticker, size } }) =>
			ProductCell({ mode, name, ticker, size })
	},
	{
		Header: "Retail Price",
		accessor: "retailPrice",
		Cell: ({ value: retailPrice }) =>
			StatCell({ stat: retailPrice, format: "dollar" })
	},
	{
		Header: "Last Price",
		accessor: "latestPrice",
		Cell: ({ value: { latestPrice, latestChange } }) =>
			SpecialPriceCell({ latestPrice, latestChange })
	},
	{
		Header: "Total Gain",
		accessor: "totalGain",
		Cell: ({ value: { lastPrice, retailPrice } }) =>
			SpecialGainCell({ lastPrice, retailPrice })
	},
	{
		Header: "Lowest Ask",
		accessor: "lowestAsk",
		Cell: ({ value: lowestAsk }) =>
			StatCell({ stat: lowestAsk, format: "dollar" })
	},
	{
		Header: "Highest Bid",
		accessor: "highestBid",
		Cell: ({ value: highestBid }) =>
			StatCell({ stat: highestBid, format: "dollar" })
	},
	{
		Header: "52 Week High",
		accessor: "ytdHigh",
		isVisible: false,
		Cell: ({ value: ytdHigh }) =>
			StatCell({ stat: ytdHigh, format: "dollar" })
	},
	{
		Header: "52 Week Low",
		accessor: "ytdLow",
		Cell: ({ value: ytdLow }) =>
			StatCell({ stat: ytdLow, format: "dollar" })
	},
	{
		Header: "Volatility",
		accessor: "volatility",
		Cell: ({ value: volatility }) =>
			StatCell({ stat: volatility, format: "percent" })
	},
	{
		Header: "Average Price",
		accessor: "avgPrice",
		Cell: ({ value: avgPrice }) =>
			StatCell({ stat: avgPrice, format: "dollar" })
	},
	{
		Header: "Total Sales",
		accessor: "totalSales",
		Cell: ({ value: totalSales }) =>
			StatCell({ stat: totalSales, format: "number" })
	},
	{
		Header: "",
		accessor: "action",
		Cell: ({ value: { child, parent, shoeId, name } }) =>
			ActionCell({
				child,
				parent,
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
	listShoes: string[],
	shoeChildren: Record<string, ShoeChild[]>
): Record<string, string | number>[] => {
	if (Object.keys(shoeInfos).length === 0) return [];
	const tableData = [];
	listShoes.map((urlKey: string) => {
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
					parent: urlKey,
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
		width: 200,
		Cell: ({ value }) => value
	},
	{
		Header: "Time",
		accessor: "time",
		width: 200,
		Cell: ({ value }) => value
	},
	{
		Header: "Size",
		accessor: "shoeSize",
		width: 200,
		Cell: ({ value }) => value
	},
	{
		Header: "Sale Price",
		accessor: "amount",
		width: 200,
		Cell: ({ value }) => value
	},
	{
		Header: "Profit/Loss",
		accessor: "profit",
		width: 200,
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
			let formattedTime;
			if (hours === 0 || hours === 12) {
				formattedTime = `12:${saleDate
					.getMinutes()
					.toString()
					.padStart(2, "0")} ${hours === 0 ? "AM" : "PM"}`;
			} else {
				formattedTime = `${
					hours > 12 ? hours - 12 : hours
				}:${saleDate.getMinutes().toString().padStart(2, "0")} ${
					hours > 12 ? "PM" : "AM"
				}`;
			}

			const profit = Math.round(amount as number) - retailPrice;
			tableData.push({
				date: `${
					months[
						(saleDate.getMonth() + 1).toString().padStart(2, "0")
					]
				} ${saleDate.getDate()}, ${saleDate.getFullYear()}`,
				time: formattedTime,
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
