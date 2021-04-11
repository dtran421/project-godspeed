import React from "react";
import { useState } from "react";

import WatchlistList from "../components/Dashboard/WatchlistList";
import WatchlistDisplay from "../components/Dashboard/WatchlistDisplay";

import Navbar from "../components/Global/Navbar";

const lists: string[] = ["Current", "Hot", "Sexy"];

const currentList = [
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe"
];

const Dashboard: React.FunctionComponent<null> = () => {
	const [activeList, setActiveList] = useState(0);

	return (
		<div className="w-full">
			<div className="flex flex-col w-full min-h-screen bg-gray-100">
				<Navbar page={"Dashboard"} />
				<div className="flex-1 flex justify-center items-center">
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
				</div>
			</div>

			<footer className="footer"></footer>
		</div>
	);
};

export default Dashboard;
