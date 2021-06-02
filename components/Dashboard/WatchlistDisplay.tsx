import React, {
	FC,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	useRef,
	useContext
} from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

import { DashboardGraphConfig } from "../Global/Configs/GraphConfig";
import { DashboardContext } from "../../pages/dashboard";
import Table from "./Table/Table";

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
	const { theme } = useTheme();

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
	}, [theme]);

	const fetchGraphData = async (newGraphShoe: string) => {
		await fetch(`/api/graph/${shoeInfos[newGraphShoe].uuid}`)
			.then((response) => response.json())
			.then(({ data: newData }) => {
				updateGraphOptions({
					...graphOptions,
					series: [{ ...graphOptions.series[0], data: newData }]
				});
				updateGraphShoe([newGraphShoe, shoeName, newData]);
				graphRef.current.chart.hideLoading();
			});
	};

	const graphRef = useRef(null);
	useEffect(() => {
		if (graphShoe) {
			fetchGraphData(graphShoe);
			if (graphRef.current !== null) {
				graphRef.current.chart.showLoading();
			}
		}
	}, [graphShoe, shoeName]);

	return isFetching || isFetchingShoes || isFetchingChildren ? (
		<div className="w-full h-96 flex p-6 items-center justify-center my-auto opacity-90">
			<GridLoader color={"#7C3AED"} size={24} margin={6} />
		</div>
	) : (
		<>
			{activeList && (
				<div className="grid grid-cols-3 gap-6 divide-y-6">
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
						<h2 className="text-gray-700 dark:text-gray-300">
							Currently viewing
						</h2>
						<h3 className="text-2xl font-medium">{activeList}</h3>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
						<h2 className="text-gray-700 dark:text-gray-300">
							Items tracking
						</h2>
						<h3 className="text-2xl font-medium">
							{listShoes.length}
						</h3>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
						<h2 className="text-gray-700 dark:text-gray-300">
							Date created
						</h2>
						<h3 className="text-2xl font-medium">{creationDate}</h3>
					</div>
				</div>
			)}
			{listShoes.length ? (
				<>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
						<div className="bg-white dark:bg-gray-900 rounded-xl m-8 p-4">
							<h3 className="text-xl text-center font-medium mb-6">
								{shoeName}
							</h3>
							{graphOptions.series[0].data.length !== 0 && (
								<HighchartsReact
									ref={graphRef}
									highcharts={Highcharts}
									constructorType={"stockChart"}
									options={graphOptions}
									allowChartUpdate={true}
								/>
							)}
						</div>
					</div>
					<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
						<div className="w-full">
							{tableData && (
								<Table
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
		</>
	);
};

export default WatchlistDisplay;
