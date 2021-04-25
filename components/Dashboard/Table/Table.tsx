import React, { FC, Dispatch, SetStateAction, useState, useMemo } from "react";
import { useTable, useExpanded, useSortBy } from "react-table";

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

export interface CondensedTableProps {
	tableData: Record<string, string>[];
	updateGraphShoe: Dispatch<SetStateAction<string[]>>;
}

const CondensedTable: FC<CondensedTableProps> = ({
	tableData,
	updateGraphShoe
}: CondensedTableProps) => {
	const [mode, setMode] = useState("Minimal");
	const condensedColumns = useMemo(
		() => [
			{
				Header: "Product",
				accessor: "imageUrl",
				Cell: ({ value: imageUrl }) => imageCell({ imageUrl })
			},
			{
				Header: "",
				accessor: "product",
				width: 200,
				Cell: ({ value: { name, ticker, size } }) =>
					productCell({ mode, name, ticker, size })
			},
			{
				Header: "Retail Price",
				accessor: "retailPrice",
				Cell: ({ value: retailPrice }) =>
					statCell({ stat: retailPrice })
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
				Cell: ({ value: lowestAsk }) => statCell({ stat: lowestAsk })
			},
			{
				Header: "Highest Bid",
				accessor: "highestBid",
				Cell: ({ value: highestBid }) => statCell({ stat: highestBid })
			},
			{
				Header: "52 Week High",
				accessor: "ytdHigh",
				isVisible: false,
				Cell: ({ value: ytdHigh }) => statCell({ stat: ytdHigh })
			},
			{
				Header: "52 Week Low",
				accessor: "ytdLow",
				Cell: ({ value: ytdLow }) => statCell({ stat: ytdLow })
			},
			{
				Header: "Volatility",
				accessor: "volatility",
				Cell: ({ value: volatility }) => statCell({ stat: volatility })
			},
			{
				Header: "Average Price",
				accessor: "avgPrice",
				Cell: ({ value: avgPrice }) => statCell({ stat: avgPrice })
			},
			{
				Header: "Total Sales",
				accessor: "totalSales",
				Cell: ({ value: totalSales }) => statCell({ stat: totalSales })
			},
			{
				Header: "",
				accessor: "action",
				Cell: ({ value: { child, urlKey, name } }) =>
					actionCell({ child, urlKey, name }, updateGraphShoe)
			},
			{
				id: "expander",
				Header: (props) => expanderHeader(props),
				Cell: (props) => expanderCell(props)
			}
		],
		[mode]
	);
	let hiddenColumns;
	if (mode === "Minimal") {
		hiddenColumns = [
			"ytdHigh",
			"ytdLow",
			"volatility",
			"avgPrice",
			"totalSales"
		];
	} else {
		hiddenColumns = ["imageUrl"];
	}

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable(
		{
			columns: condensedColumns,
			data: tableData,
			initialState: { hiddenColumns }
		},
		useSortBy,
		useExpanded
	);

	return (
		<>
			<button
				className={`${
					mode === "Minimal"
						? "text-purple-600"
						: "bg-purple-600 text-white"
				} border-2 border-purple-600 font-semibold rounded-lg px-6 py-3 m-4 focus:outline-none`}
				onClick={() =>
					setMode(mode === "Minimal" ? "Detailed" : "Minimal")
				}
			>
				View Mode: {mode}
			</button>
			<table {...getTableProps()} className="w-full">
				<thead>
					{headerGroups.map((headerGroup, index) => (
						<tr key={index} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column, index) => {
								return column.id === "" ? (
									<th
										key={index}
										{...column.getHeaderProps()}
										className={`bg-gray-200`}
									>
										{column.render("Header")}
									</th>
								) : (
									<th
										key={index}
										{...column.getHeaderProps(
											column.getSortByToggleProps()
										)}
										className={`bg-gray-200 ${
											column.id === "product" && "w-56"
										}`}
									>
										<button className="text-center font-semibold px-2 py-3 focus:outline-none">
											{column.render("Header")}
											<span>
												{column.isSorted
													? column.isSortedDesc
														? " 🔽"
														: " 🔼"
													: ""}
											</span>
										</button>
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
							<tr
								key={rowIndex}
								{...row.getRowProps()}
								className={`${
									rowIndex < rows.length - 1
										? "border-b-2 border-gray-200"
										: ""
								} ${
									row.canExpand &&
									row.isExpanded &&
									"bg-blue-50"
								}`}
							>
								{row.cells.map((cell, cellIndex) => {
									return (
										<td
											key={cellIndex}
											{...cell.getCellProps()}
											className={`${
												mode === "Minimal" &&
												cellIndex > 1
													? "align-text-top"
													: ""
											} ${
												mode === "Detailed" &&
												"align-middle"
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
		</>
	);
};

export default CondensedTable;
