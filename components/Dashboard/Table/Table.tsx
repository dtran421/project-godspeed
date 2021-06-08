import React, {
	FC,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo
} from "react";
import { useTable, useExpanded, useSortBy } from "react-table";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { DashboardTableColumns } from "./PrepareTableData";

import { DashboardContext } from "../../../pages/dashboard";

export interface CondensedTableProps {
	mode: string;
	tableData: Record<string, string | number>[];
	updateGraphShoe: Dispatch<SetStateAction<[string, string, number[]]>>;
}

const CondensedTable: FC<CondensedTableProps> = ({
	mode,
	tableData,
	updateGraphShoe
}: CondensedTableProps) => {
	const { deleteShoe } = useContext(DashboardContext);

	const columns = useMemo(
		() => DashboardTableColumns(mode, updateGraphShoe, deleteShoe),
		[deleteShoe, mode, updateGraphShoe]
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
		<table {...getTableProps()} className="w-full h-full">
			<thead>
				{headerGroups.map((headerGroup, index) => (
					<tr key={index} {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column, index) => {
							return column.id === "imageUrl" ||
								column.id === "action" ||
								column.id === "expander" ? (
								<th
									key={index}
									{...column.getHeaderProps()}
									className={`font-semibold bg-gray-200 dark:bg-gray-700 dark:text-gray-300 ${
										column.id === "imageUrl" ? "px-8" : ""
									}`}
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
										column.id === "product" && "w-56"
									}`}
								>
									<button
										className={`w-full ${
											column.id === "product"
												? mode == "Minimal"
													? "text-left px-2"
													: "text-center lg:px-2"
												: "text-center px-2"
										} font-semibold py-3 focus:outline-none`}
									>
										{column.render("Header")}
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
									? "border-b-2 border-gray-200 dark:border-gray-700"
									: ""
							} ${
								row.depth > 0 &&
								"bg-blue-50 dark:bg-gray-700 dark:bg-opacity-20"
							}`}
						>
							{row.cells.map((cell, cellIndex) => {
								return (
									<td
										key={cellIndex}
										{...cell.getCellProps()}
										className={`${
											cell.column.id === "action" ||
											cell.column.id === "expander"
												? ""
												: "px-2"
										} xl:px-0 ${
											mode === "Minimal" && cellIndex > 1
												? "align-text-top"
												: ""
										} ${
											mode === "Detailed"
												? "align-middle"
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

export default CondensedTable;
