import React from "react";
import { useState } from "react";

import WatchlistList from "./WatchlistList";
import WatchlistDisplay from "./WatchlistDisplay";

export interface DashboardDisplayProps {
	test: number;
}

const lists: string[] = ["Current", "Hot", "Sexy"];

const currentList = [
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	}
];

const DashboardDisplay: React.FunctionComponent<DashboardDisplayProps> = () => {
	const [activeList, setActiveList] = useState(0);

	return (
		<div className="w-full justify-center py-24">
			<div className="flex items-start mx-auto max-w-7xl">
				<WatchlistList
					lists={lists}
					active={activeList}
					setList={setActiveList}
				/>
				<WatchlistDisplay activeList={currentList} />
			</div>
		</div>
	);
};

export default DashboardDisplay;
