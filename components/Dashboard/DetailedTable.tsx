import React from "react";
import { useMemo } from "react";
import { useTable } from "react-table";

import { CardInfo } from "../../pages/api/StructureTypes";
import { specialGainCell } from "./CondensedTable";

export interface DetailedTableProps {
	tableData: Record<string, string>[];
}

const DetailedTable: React.FunctionComponent<DetailedTableProps> = ({
	tableData
}: DetailedTableProps) => {
	const detailedColumns = useMemo(
		() => [
			{
				Header: "Product",
				accessor: "product",
				Cell: (props: Record<string, CardInfo>) =>
					productCell(props.value)
			},
			{
				Header: "Retail Price",
				accessor: "retailPrice",
				Cell: (props: Record<string, string>) => statCell(props.value)
			},
			{
				Header: "Market Price",
				accessor: "latestPrice",
				Cell: (props: Record<string, Record<string, number>>) =>
					specialStatCell(
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
			},
			{
				Header: "52 Week High",
				accessor: "ytdHigh",
				Cell: (props) => statCell(props.value)
			},
			{
				Header: "52 Week Low",
				accessor: "ytdLow",
				Cell: (props) => statCell(props.value)
			},
			{
				Header: "Volatility",
				accessor: "volatility",
				Cell: (props) => statCell(props.value)
			},
			{
				Header: "Average Price",
				accessor: "avgPrice",
				Cell: (props) => statCell(props.value)
			},
			{
				Header: "Total Sales",
				accessor: "totalSales",
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
	} = useTable({ columns: detailedColumns, data: tableData });

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
											rowIndex % 2 == 1
												? "bg-gray-100"
												: ""
										}`}
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

const productCell: React.FunctionComponent<CardInfo> = (shoeInfo: CardInfo) => {
	return (
		<div className="p-5">
			<p className="text-center font-semibold">{shoeInfo.ticker}</p>
		</div>
	);
};

const statCell: React.FunctionComponent<string> = (stat: string) => {
	return (
		<p className="text-lg text-center font-semibold px-4 align-top py-5">
			{stat}
		</p>
	);
};

const specialStatCell: React.FunctionComponent<number> = (
	latestPrice: number,
	latestChange: number
) => {
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

export default DetailedTable;
