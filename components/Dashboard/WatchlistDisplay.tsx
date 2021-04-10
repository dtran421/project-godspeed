import { get } from "jquery";
import React from "react";
import { useState, useMemo } from "react";

import ShoeCard from "./ShoeCard";
import prepareTableData from "./PrepareTableData";
import CondensedTable from "./CondensedTable";
import DetailedTable from "./DetailedTable";

export interface WatchlistDisplayProps {
	activeList: Record<string, unknown>[];
}

export interface CardInfo {
	ticker: string;
	imageUrl: string;
	colorway: string;
	releaseDate: string;
	retailPrice: number;
	latestPrice: Record<string, number>;
	latestChange: Record<string, number>;
	ytdPrice: Record<string, number>;
	volatility: number;
	meanPrice: number;
	sales: number;
}

const shoeInfos: { [id: string]: CardInfo } = {
	"air-jordan-1-retro-high-bred-toe": {
		ticker: "AJ1H-BREDTOE",
		imageUrl:
			"https://stockx-360.imgix.net/Air-Jordan-1-Retro-High-Bred-Toe/Images/Air-Jordan-1-Retro-High-Bred-Toe/Lv2/img01.jpg?auto=compress&w=559&q=90&dpr=2&updated_at=1606322598&fit=clip&fm=jpg&ixlib=react-9.0.3",
		colorway: "Gym Red/Black-Summit",
		releaseDate: "02/24/2018",
		retailPrice: 160,
		latestPrice: {
			last: 500,
			ask: 420,
			bid: 710
		},
		latestChange: {
			dollar: -209,
			percent: -29
		},
		ytdPrice: {
			high: 999,
			low: 214
		},
		volatility: 15.2,
		meanPrice: 631,
		sales: 2484
	}
};

const WatchlistDisplay: React.FunctionComponent<WatchlistDisplayProps> = ({
	activeList
}: WatchlistDisplayProps) => {
	const [mode, setMode] = useState("Condensed");

	const tableData = useMemo(
		() => prepareTableData(shoeInfos, activeList),
		[]
	);

	return (
		<div className="w-full bg-white rounded-xl shadow-lg p-8">
			<button
				className={`${
					mode === "Condensed"
						? "text-purple-600"
						: "bg-purple-600 text-white"
				} border-2 border-purple-600 font-semibold rounded-lg px-6 py-3 mb-8 focus:outline-none`}
				onClick={() =>
					setMode(mode === "Condensed" ? "Detailed" : "Condensed")
				}
			>
				View Mode: {mode}
			</button>
			{mode === "Condensed" ? (
				<CondensedTable tableData={tableData} />
			) : (
				<DetailedTable tableData={tableData} />
			)}
		</div>
	);
};

export default WatchlistDisplay;
