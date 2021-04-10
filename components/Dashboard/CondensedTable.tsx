import React from "react";
import { useMemo } from "react";
import { useTable } from "react-table";

import { CardInfo } from "./WatchlistDisplay";

export interface CondensedTableProps {
	tableData: Record<string, string>[];
}

const CondensedTable: React.FunctionComponent<CondensedTableProps> = ({
	tableData
}: CondensedTableProps) => {
	const condensedColumns = useMemo(
		() => [
			{
				Header: "Product",
				accessor: "image",
				Cell: (props) => imageCell(props.value)
			},
			{
				Header: "",
				accessor: "product",
				Cell: (props) =>
					productCell(props.value.name, props.value.shoeInfo)
			},
			{
				Header: "Market Price",
				accessor: "latestPrice",
				Cell: (props) =>
					specialPriceCell(
						props.value.latestPrice,
						props.value.latestChange
					)
			},
			{
				Header: "YTD Gain",
				accessor: "ytdGain",
				Cell: (props) =>
					specialGainCell(
						props.value.ytdGain,
						props.value.retailPrice
					)
			},
			{
				Header: "Lowest Ask",
				accessor: "lowestAsk",
				Cell: (props) => statCell(props.value)
			},
			{
				Header: "Highest Bid",
				accessor: "highestBid",
				Cell: (props) => statCell(props.value)
			}
		],
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({ columns: condensedColumns, data: tableData });

	return (
		<table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup, index) => (
					<tr key={index} {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column, index) => {
							return (
								<th
									key={index}
									{...column.getHeaderProps()}
									className="text-center font-semibold px-4"
								>
									{column.render("Header")}
								</th>
							);
						})}
					</tr>
				))}
			</thead>
			<tbody {...getTableBodyProps()}>
				{rows.map((row, rowIndex) => {
					prepareRow(row);
					return (
						<tr key={rowIndex} {...row.getRowProps()}>
							{row.cells.map((cell, cellIndex) => {
								return (
									<td
										key={cellIndex}
										{...cell.getCellProps()}
										className={`${
											cellIndex > 1
												? "align-text-top"
												: ""
										}
													${rowIndex % 2 == 1 && cellIndex > 0 ? "bg-gray-100" : ""}`}
									>
										{cell.render("Cell")}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

const imageCell = (imageUrl: string) => {
	return (
		<div className="flex items-center pr-2">
			<img
				width="100"
				height="100"
				src={imageUrl}
				className="rounded-lg"
			/>
		</div>
	);
};

const productCell = (name: string, shoeInfo: CardInfo) => {
	return (
		<div className="flex flex-col justify-between p-5">
			<div className="flex flex-col">
				<p className="text-xl font-bold">{name}</p>
				<div className="flex flex-row justify-between">
					<p className="font-semibold text-purple-500">
						{shoeInfo.ticker}
					</p>
					<p className="font-semibold">${shoeInfo.retailPrice}</p>
				</div>
			</div>
			<div>
				<p className="text-sm font-semibold text-gray-800">
					Colorway: {shoeInfo.colorway}
				</p>
				<p className="text-sm font-semibold text-gray-800">
					Release Date: {shoeInfo.releaseDate}
				</p>
			</div>
		</div>
	);
};

const statCell = (stat: string) => {
	return (
		<p className="text-lg text-center font-semibold px-4 align-top py-5">
			{stat}
		</p>
	);
};

const specialPriceCell = (latestPrice: number, latestChange: number) => {
	return (
		<p
			className={`text-lg text-center font-semibold px-4 align-top py-5 ${
				latestChange >= 0 ? "text-green-400" : "text-red-400"
			}`}
		>
			${latestPrice} ({latestChange}
			%)
		</p>
	);
};

export const specialGainCell = (
	lastPrice: number,
	retailPrice: number
): JSX.Element => {
	const gain = lastPrice - retailPrice;
	return (
		<p
			className={`text-lg text-center font-semibold px-4 ${
				gain >= 0 ? "text-green-400" : "text-red-400"
			}`}
		>
			${gain} ({Math.round((gain / retailPrice) * 100) / 100}
			%)
		</p>
	);
};

export default CondensedTable;
