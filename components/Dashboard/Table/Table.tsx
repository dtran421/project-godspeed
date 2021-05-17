import React, { FC, Dispatch, SetStateAction, useState, useMemo } from "react";
import { useTable, useExpanded, useSortBy } from "react-table";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { DashboardTableColumns } from "./PrepareTableData";

const deleteShoe = (shoeId: string) => {
	console.log(shoeId);
	return;
};

export interface CondensedTableProps {
	tableData: Record<string, string | number>[];
	updateGraphShoe: Dispatch<SetStateAction<string[]>>;
}

const CondensedTable: FC<CondensedTableProps> = ({
	tableData,
	updateGraphShoe
}: CondensedTableProps) => {
	const [mode, setMode] = useState("Minimal");
	const columns = useMemo(
		() => DashboardTableColumns(mode, updateGraphShoe, deleteShoe),
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
			columns: columns,
			data: tableData,
			initialState: { hiddenColumns }
		},
		useSortBy,
		useExpanded
	);

	const sortArrowProps = {
		size: 24,
		className: "inline-block px-1"
	};
	return (
		<>
			<button
				className={`${
					mode === "Minimal"
						? "text-purple-600 dark:text-purple-500"
						: "bg-purple-600 text-white"
				} border border-purple-600 font-semibold rounded-lg px-6 py-3 m-4 focus:outline-none`}
				onClick={() =>
					setMode(mode === "Minimal" ? "Detailed" : "Minimal")
				}
			>
				View Mode: {mode}
			</button>
			<div className="overflow-x-scroll">
				<div className="w-screen">
					<table {...getTableProps()}>
						<thead>
							{headerGroups.map((headerGroup, index) => (
								<tr
									key={index}
									{...headerGroup.getHeaderGroupProps()}
								>
									{headerGroup.headers.map(
										(column, index) => {
											return column.id === "imageUrl" ? (
												<th
													key={index}
													{...column.getHeaderProps()}
													className="bg-gray-200 dark:bg-gray-700"
												>
													{column.render("Header")}
												</th>
											) : (
												<th
													key={index}
													{...column.getHeaderProps(
														column.getSortByToggleProps()
													)}
													className={`bg-gray-200 dark:bg-gray-700 dark:text-gray-300 ${
														column.id ===
															"product" && "w-56"
													}`}
												>
													<button
														className={`w-full ${
															column.id ===
																"product" &&
															mode == "Minimal"
																? "text-left"
																: "text-center"
														} font-semibold px-2 py-3 focus:outline-none`}
													>
														{column.render(
															"Header"
														)}
														{column.isSorted ? (
															column.isSortedDesc ? (
																<>
																	{" "}
																	<BsCaretDownFill
																		{...sortArrowProps}
																	/>
																</>
															) : (
																<>
																	{" "}
																	<BsCaretUpFill
																		{...sortArrowProps}
																	/>
																</>
															)
														) : (
															""
														)}
													</button>
												</th>
											);
										}
									)}
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
												? "border-b-2 border-gray-200 dark:border-gray-700"
												: ""
										} ${
											!row.canExpand &&
											"bg-blue-50 dark:bg-gray-700 dark:bg-opacity-20"
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
				</div>
			</div>
		</>
	);
};

export default CondensedTable;
