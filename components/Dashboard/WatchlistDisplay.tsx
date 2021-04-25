import React, { FC, useState, useEffect, useRef } from "react";
import GridLoader from "react-spinners/GridLoader";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

import { CardInfo, ShoeInfo } from "../../pages/api/StructureTypes";
import prepareTableData from "./Table/PrepareTableData";
import Table from "./Table/Table";

if (typeof Highcharts === "object") {
	HighchartsExporting(Highcharts);
}

const options = {
	chart: {
		type: "areaspline"
	},
	title: {
		text: "Watchlist Performance"
	},
	subtitle: {
		text: ""
	},
	plotOptions: {
		areaspline: {
			color: "#3B82F6",
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, "#8B5CF6"],
					[1, "#FFFFFF"]
				]
			},
			lineColor: "#7C3AED",
			tooltip: {
				split: false,
				pointFormat: "{series.name}: {point.y}",
				valueDecimals: 2,
				valuePrefix: "$",
				xDateFormat: "%b %e, %Y"
			}
		}
	},
	xAxis: {
		type: "datetime"
	},
	series: [
		{
			name: "Sale price",
			type: "areaspline",
			data: [0],
			xAxis: 0,
			states: {
				hover: {
					halo: {
						size: 8,
						attributes: {
							fill: "#7C3AED",
							stroke: "#000000",
							"stroke-width": 2
						}
					}
				}
			}
		}
	],
	credits: {
		enabled: false
	}
};

const fetchShoeInfos = async (
	shoeInfos: ShoeInfo,
	list: string[]
): Promise<ShoeInfo> => {
	const newShoeInfos = shoeInfos;
	const fetchRequests = list.map(async (shoe) => {
		if (!(shoe in newShoeInfos)) {
			const promise = await fetch(`/api/fetchShoe/${shoe}`)
				.then((response) => response.json())
				.then((shoeData: CardInfo) => {
					newShoeInfos[shoe] = shoeData;
				});
			return promise;
		}
	});
	await Promise.all(fetchRequests);
	return newShoeInfos;
};

interface WatchlistDisplayProps {
	shoeChildren: Record<string, string[]> | null;
}

const WatchlistDisplay: FC<WatchlistDisplayProps> = ({
	shoeChildren
}: WatchlistDisplayProps) => {
	let activeShoes;
	if (shoeChildren !== null) {
		activeShoes = Object.keys(shoeChildren);
	} else {
		activeShoes = [];
	}
	const [[isFetching, shoeInfos], updateShoeInfos] = useState([true, {}]);
	const [tableData, updateTableData] = useState([]);

	const processShoeInfos = async () => {
		const newShoeInfos = await fetchShoeInfos(shoeInfos, activeShoes);
		updateShoeInfos([false, newShoeInfos]);
		updateTableData(
			prepareTableData(newShoeInfos, activeShoes, shoeChildren)
		);
		if (activeShoes.length > 0) {
			updateGraphShoe([
				activeShoes[0],
				newShoeInfos[activeShoes[0]].name
			]);
		}
	};

	useEffect(() => {
		if (shoeChildren !== null) {
			processShoeInfos();
		}
	}, [shoeChildren]);

	const [[graphShoe, shoeName], updateGraphShoe] = useState(["", ""]);
	const [graphOptions, updateGraphOptions] = useState(options);
	const graphRef = useRef(null);

	const fetchGraphData = async (newGraphShoe: string) => {
		await fetch(`/api/graph/${shoeInfos[newGraphShoe].uuid}`)
			.then((response) => response.json())
			.then(({ data: newData }) => {
				updateGraphOptions({
					...graphOptions,
					subtitle: { text: shoeName },
					series: [{ ...graphOptions.series[0], data: newData }]
				});
				graphRef.current.chart.hideLoading();
			});
	};

	useEffect(() => {
		if (graphShoe !== "") {
			fetchGraphData(graphShoe);
			if (graphRef.current !== null) {
				graphRef.current.chart.showLoading();
			}
		}
	}, [graphShoe, shoeName]);

	return (
		<div className="w-full bg-white rounded-xl shadow-lg">
			{activeShoes.length > 0 ? (
				<>
					{isFetching ? (
						<div className="flex p-6 justify-center my-auto opacity-90">
							<GridLoader
								color={"#7C3AED"}
								loading={isFetching}
								size={18}
								margin={6}
							/>
						</div>
					) : (
						<div className="w-full">
							<div className="p-8">
								{graphOptions.series[0].data.length > 0 && (
									<HighchartsReact
										ref={graphRef}
										highcharts={Highcharts}
										constructorType={"stockChart"}
										options={graphOptions}
										allowChartUpdate={true}
									/>
								)}
							</div>
							{tableData && (
								<Table
									tableData={tableData}
									updateGraphShoe={updateGraphShoe}
								/>
							)}
						</div>
					)}
				</>
			) : (
				<div className="w-full flex flex-col justify-center">
					<p className="text-xl text-center text-gray-700 p-16 m-4">
						No data to show.{" "}
						{shoeChildren === null
							? "Create a new watchlist to get started!"
							: "Add a shoe to track!"}
					</p>
				</div>
			)}
		</div>
	);
};

export default WatchlistDisplay;
