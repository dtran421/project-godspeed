import React, { FC } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";

import { lgScreenQuery } from "../Global/Configs/Breakpoints";

export interface StatsObject {
	condition: string;
	lastPrice: number;
	percentChange: number;
	ask: number;
	bid: number;
	gain: number;
	sales: number;
	avgPrice: number;
	volatility: number;
	low: number;
	high: number;
}

interface StatsPanelProps {
	info: {
		uuid: string;
		urlKey: string;
		colorway: string;
		releaseDate: string;
		retailPrice: number;
	};
	stats: StatsObject;
}

const StatsPanel: FC<StatsPanelProps> = ({
	info: { uuid, urlKey, colorway, releaseDate, retailPrice },
	stats: {
		condition,
		lastPrice,
		percentChange,
		ask,
		bid,
		gain,
		sales,
		avgPrice,
		volatility,
		low,
		high
	}
}: StatsPanelProps) => {
	const lgScreen = useMediaQuery(lgScreenQuery);

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="flex text-2xl font-medium">
				<h2>Last Price: ${lastPrice}</h2>
				<p
					className={`flex items-center text-center text-xl rounded-full px-4 mx-4 ${
						percentChange >= 0
							? "text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-800 dark:bg-opacity-30"
							: "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-800 dark:bg-opacity-30"
					}`}
				>
					{percentChange >= 0 ? (
						<BsCaretUpFill size={24} />
					) : (
						<BsCaretDownFill size={24} />
					)}
					{percentChange}%
				</p>
			</div>
			<div className="grid grid-cols-2 gap-x-6 mt-3 mb-8 lg:mb-0">
				<div className="flex items-center justify-center">
					<BsCaretDownFill
						size={16}
						className="inline align-middle text-red-500"
					/>
					<p className="text-lg text-center font-bold text-red-500 px-1">
						ASK
					</p>
				</div>
				<div className="flex items-center justify-center">
					<BsCaretUpFill
						size={16}
						className="inline align-middle text-green-500"
					/>
					<p className="text-lg text-center font-bold text-green-500 px-1">
						BID
					</p>
				</div>
				<a
					href={`https://stockx.com/sell/${uuid}/${urlKey}`}
					target="_blank"
					rel="noreferrer"
					className="w-32 text-lg text-center font-semibold text-red-500 px-4 py-1 rounded-full hover:text-white hover:bg-red-500 border-2 border-red-500 hover:cursor-pointer"
				>
					${ask}
				</a>
				<a
					href={`https://stockx.com/buy/${uuid}/${urlKey}`}
					target="_blank"
					rel="noreferrer"
					className="w-32 text-lg text-center font-semibold text-green-500 px-4 py-1 rounded-full hover:text-white hover:bg-green-500 border-2 border-green-500 hover:cursor-pointer"
				>
					${bid}
				</a>
			</div>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 my-6 text-xl">
				<RowCell position={"top"} label={"Colorway"} value={colorway} />
				<RowCell
					position={"top"}
					label={"Condition"}
					value={condition}
				/>
				<RowCell
					position={"middle"}
					label={"Release Date"}
					value={releaseDate}
				/>
				<RowCell
					position={"middle"}
					label={"Retail Price"}
					value={`$${retailPrice}`}
				/>
				<RowCell
					position={"middle"}
					label={"Total Gain"}
					value={`$${gain} (${
						Math.round((gain / retailPrice) * 10000) / 100
					}%)`}
					valueClass={`${
						gain >= 0 ? "text-green-500" : "text-red-500"
					}`}
				/>
				<RowCell
					position={"middle"}
					label={"Total Sales"}
					value={sales}
				/>
				<RowCell
					position={"middle"}
					label={"Average Price"}
					value={`$${avgPrice}`}
				/>
				<RowCell
					position={"middle"}
					label={"Volatility"}
					value={`${Math.round(volatility * 10000) / 100}%`}
				/>
				<RowCell
					position={lgScreen ? "bottom" : "middle"}
					label={"Annual Low"}
					value={`$${low}`}
				/>
				<RowCell
					position={"bottom"}
					label={"Annual High"}
					value={`$${high}`}
				/>
			</div>
		</div>
	);
};

interface CellProps {
	position: string;
	label: string;
	value: string | number;
	valueClass?: string;
}

const RowCell: FC<CellProps> = ({
	position,
	label,
	value,
	valueClass
}: CellProps) => {
	let divClass;
	switch (position) {
		case "top":
			divClass =
				"border-b-2 border-gray-700 dark:border-gray-600 border-opacity-40 pb-2";
			break;
		case "middle":
			divClass =
				"border-b-2 border-gray-700 dark:border-gray-600 border-opacity-40 mt-2 pb-2";
			break;
		default:
			divClass = "mt-2";
			break;
	}
	return (
		<div className={`flex justify-between ${divClass}`}>
			<p className="font-medium text-gray-800 dark:text-gray-300 mr-4">
				{label}
			</p>
			<p className={`text-right ${valueClass}`}>{value}</p>
		</div>
	);
};

export default StatsPanel;
