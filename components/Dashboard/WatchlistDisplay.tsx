import React from "react";
import { useState, useEffect } from "react";

import prepareTableData from "./PrepareTableData";
import CondensedTable from "./CondensedTable";
import DetailedTable from "./DetailedTable";

interface WatchlistDisplayProps {
	activeList: string[] | null;
}

const WatchlistDisplay: React.FunctionComponent<WatchlistDisplayProps> = ({
	activeList
}: WatchlistDisplayProps) => {
	const [mode, setMode] = useState("Condensed");
	const [shoeInfos, updateShoeInfos] = useState({});
	const [tableData, updateTableData] = useState([]);

	useEffect(() => {
		if (activeList !== null) {
			activeList.forEach((shoe) => {
				fetch(`/api/fetchShoe/${shoe}`)
					.then((response) => response.json())
					.then((shoeData) => {
						if (!(shoe in shoeInfos)) {
							const newShoeInfos = shoeInfos;
							newShoeInfos[shoe] = shoeData;
							updateShoeInfos(newShoeInfos);
							console.log(shoeInfos);
							updateTableData(
								prepareTableData(shoeInfos, activeList)
							);
						}
					});
			});
		}
	}, [activeList]);

	return (
		<div className="w-full bg-white rounded-xl shadow-lg p-8">
			{activeList !== null && activeList.length > 0 ? (
				<>
					<button
						className={`${
							mode === "Condensed"
								? "text-purple-600"
								: "bg-purple-600 text-white"
						} border-2 border-purple-600 font-semibold rounded-lg px-6 py-3 mb-8 focus:outline-none`}
						onClick={() =>
							setMode(
								mode === "Condensed" ? "Detailed" : "Condensed"
							)
						}
					>
						View Mode: {mode}
					</button>
					{tableData &&
						(mode === "Condensed" ? (
							<CondensedTable tableData={tableData} />
						) : (
							<DetailedTable tableData={tableData} />
						))}
				</>
			) : (
				<div className="w-full flex flex-col justify-center">
					<p className="text-xl text-center text-gray-700 p-16 m-4">
						No data to show.{" "}
						{activeList === null
							? "Create a new watchlist to get started!"
							: "Add a shoe to track!"}
					</p>
				</div>
			)}
		</div>
	);
};

export default WatchlistDisplay;
