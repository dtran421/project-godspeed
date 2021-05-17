import React, { FC, useMemo } from "react";
import { useTable } from "react-table";

import { SalesTableColumns } from "../Dashboard/Table/PrepareTableData";

interface SalesTableProps {
	salesData: Record<string, string | number>[];
}

const SalesTable: FC<SalesTableProps> = ({ salesData }: SalesTableProps) => {
	const columns = useMemo(() => SalesTableColumns, []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({
		columns: columns,
		data: salesData
	});

	return (
		<table {...getTableProps()} className="w-full mt-4">
			<thead>
				{headerGroups.map((headerGroup, index) => (
					<tr key={index} {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column, index) => {
							return (
								<th
									key={index}
									{...column.getHeaderProps()}
									className="text-left text-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 p-3"
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
						<tr
							key={rowIndex}
							{...row.getRowProps()}
							className={`${
								rowIndex < rows.length - 1
									? "border-b-2 border-gray-200 dark:border-gray-700"
									: ""
							}`}
						>
							{row.cells.map((cell, cellIndex) => {
								return (
									<td
										key={cellIndex}
										{...cell.getCellProps()}
										className="text-left text-lg p-3"
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

export default SalesTable;
