import React, {
	FC,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	useCallback,
	useContext
} from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useMediaQuery } from "react-responsive";

import { DashboardGraphConfig } from "../Global/Configs/GraphConfig";
import { DashboardContext } from "../../pages/dashboard";
import Table from "./Table/Table";
import { mdScreenQuery, xlScreenQuery } from "../Global/Configs/Breakpoints";

const GridLoader = dynamic(() => import("react-spinners/GridLoader"), {
	ssr: false
});

if (typeof Highcharts === "object") {
	HighchartsExporting(Highcharts);
}

interface WatchlistDisplayProps {
	activeList: string;
	listShoes: string[];
	creationDate: string;
	graphShoe: string;
	shoeName: string;
	shoeData: number[];
	updateGraphShoe: Dispatch<SetStateAction<[string, string, number[]]>>;
	tableData: Record<string, string | number>[];
}

const WatchlistDisplay: FC<WatchlistDisplayProps> = ({
	activeList,
	listShoes,
	creationDate,
	graphShoe,
	shoeName,
	shoeData,
	updateGraphShoe,
	tableData
}: WatchlistDisplayProps) => {
	const mdScreen = useMediaQuery(mdScreenQuery);
	const xlScreen = useMediaQuery(xlScreenQuery);

	const { theme } = useTheme();

	const [mode, setMode] = useState("Minimal");

	const {
		isFetching,
		isFetchingShoes,
		isFetchingChildren,
		shoeInfos
	} = useContext(DashboardContext);

	const {
		light: GraphConfigLight,
		dark: GraphConfigDark
	} = DashboardGraphConfig;
	const [graphOptions, updateGraphOptions] = useState(
		theme === "dark" ? GraphConfigDark : GraphConfigLight
	);
	useEffect(() => {
		const options = theme === "dark" ? GraphConfigDark : GraphConfigLight;
		options.series = [{ ...options.series[0], data: shoeData }];
		updateGraphOptions(options);
	}, [theme, shoeData, GraphConfigDark, GraphConfigLight]);

	useEffect(() => {
		const fetchGraphData = async (newGraphShoe: string) => {
			await fetch(`/api/graph/${shoeInfos[newGraphShoe].uuid}`)
				.then((response) => response.json())
				.then(({ data: newData }) => {
					updateGraphOptions((options) => {
						return {
							...options,
							series: [{ ...options.series[0], data: newData }]
						};
					});
					updateGraphShoe([newGraphShoe, shoeName, newData]);
				});
		};

		if (graphShoe) {
			fetchGraphData(graphShoe);
		}
	}, [graphShoe, shoeName, shoeInfos, updateGraphShoe]);

	const graphRef = useCallback(
		(graph) => {
			if (graph && graph.chart) {
				if (graphShoe) {
					graph.chart.showLoading();
					setTimeout(() => {
						graph.chart.hideLoading();
					}, 500);
				}
				if (xlScreen) {
					graph.chart.setSize(900);
				} else if (mdScreen) {
					graph.chart.setSize(600);
				} else {
					graph.chart.setSize(300);
				}
			}
		},
		[graphShoe, mdScreen, xlScreen]
	);

	return isFetching || isFetchingShoes || isFetchingChildren ? (
		<div className="w-full h-96 flex p-6 items-center justify-center my-auto opacity-90">
			<GridLoader color={"#7C3AED"} size={24} margin={6} />
		</div>
	) : (
		<div className="w-full">
			{activeList && (
				<div className="grid grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 gap-6 divide-y-6">
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 lg:p-6">
						<h2 className="text-sm lg:text-md text-gray-700 dark:text-gray-300">
							Currently viewing
						</h2>
						<h3 className="text-xl lg:text-2xl font-medium">
							{activeList}
						</h3>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 lg:p-6">
						<h2 className="text-sm lg:text-md text-gray-700 dark:text-gray-300">
							Items tracking
						</h2>
						<h3 className="text-xl lg:text-2xl font-medium">
							{listShoes.length}
						</h3>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 lg:p-6">
						<h2 className="text-sm lg:text-md text-gray-700 dark:text-gray-300">
							Date created
						</h2>
						<h3 className="text-xl lg:text-2xl font-medium">
							{creationDate}
						</h3>
					</div>
				</div>
			)}
			{listShoes.length ? (
				<>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 my-8">
						<h3 className="text-xl text-center font-medium mb-6">
							{shoeName}
						</h3>
						{graphOptions.series[0].data.length !== 0 && (
							<div className="w-full flex justify-center">
								<HighchartsReact
									ref={graphRef}
									highcharts={Highcharts}
									constructorType={"stockChart"}
									options={graphOptions}
									allowChartUpdate={true}
								/>
							</div>
						)}
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg pt-4 pb-8">
						<button
							className={`${
								mode === "Minimal"
									? "text-purple-600 dark:text-purple-500"
									: "bg-purple-600 text-white"
							} border-2 border-purple-600 font-semibold rounded-lg px-6 py-3 ml-4 mb-4 focus:outline-none`}
							onClick={() =>
								setMode(
									mode === "Minimal" ? "Detailed" : "Minimal"
								)
							}
						>
							View Mode: {mode}
						</button>
						<div className="w-full h-full overflow-x-auto">
							{tableData && (
								<Table
									mode={mode}
									tableData={tableData}
									updateGraphShoe={updateGraphShoe}
								/>
							)}
						</div>
					</div>
				</>
			) : (
				<div className="w-full flex flex-col justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 my-8">
					<p className="text-xl text-center text-gray-700 dark:text-gray-300 p-16 m-4">
						No data to show.{" "}
						{activeList
							? "Add a shoe to track!"
							: "Create a new watchlist to get started!"}
					</p>
				</div>
			)}
		</div>
	);
};

export default WatchlistDisplay;
