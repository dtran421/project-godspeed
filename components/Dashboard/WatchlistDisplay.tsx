import React from "react";
import { useState, useEffect } from "react";

import prepareTableData from "./PrepareTableData";
import CondensedTable from "./CondensedTable";
import DetailedTable from "./DetailedTable";

export interface WatchlistDisplayProps {
	activeList: string[];
}

const WatchlistDisplay: React.FunctionComponent<WatchlistDisplayProps> = ({
	activeList
}: WatchlistDisplayProps) => {
	const [mode, setMode] = useState("Condensed");
	const [shoeInfos, updateShoeInfos] = useState({});
	const [tableData, updateTableData] = useState([]);

	useEffect(() => {
		activeList.forEach((shoe) => {
			fetch(`/api/fetchShoes?shoe=${shoe}`)
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
	}, []);

	return (
		<div className="w-full bg-white rounded-xl shadow-lg p-8">
			<button
				className={`${
					mode === "Condensed"
						? "bg-purple-50 text-purple-600"
						: "bg-purple-600 text-white"
				} border-2 border-purple-600 font-semibold rounded-lg px-6 py-3 mb-8 focus:outline-none`}
				onClick={() =>
					setMode(mode === "Condensed" ? "Detailed" : "Condensed")
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
		</div>
	);
};

/* export async function getServerSideProps(context) {
	return {
		props: {}
	};
} */

export default WatchlistDisplay;
