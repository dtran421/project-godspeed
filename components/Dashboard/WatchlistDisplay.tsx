import React, { FC, useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import GridLoader from "react-spinners/GridLoader";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

import { DashboardGraphConfig as GraphConfig } from "./GraphConfig";
import {
	CardInfo,
	ShoeInfos,
	ChildInfo,
	ChildInfos,
	ShoeChild
} from "../../pages/api/StructureTypes";
import { prepareDashboardTable } from "./Table/PrepareTableData";
import Table from "./Table/Table";

if (typeof Highcharts === "object") {
	HighchartsExporting(Highcharts);
}

const fetchShoeInfos = async (
	shoeInfos: Record<string, CardInfo>,
	list: string[]
): Promise<ShoeInfos> => {
	const newShoeInfos = shoeInfos;
	const fetchRequests = list.map(async (urlKey) => {
		if (!(urlKey in newShoeInfos)) {
			newShoeInfos[urlKey] = {} as CardInfo;
			const promise = await fetch(`/api/fetchShoe/${urlKey}`)
				.then((response) => response.json())
				.then((shoeData: CardInfo) => {
					newShoeInfos[urlKey] = shoeData;
				});
			return promise;
		}
	});
	await Promise.all(fetchRequests);
	return newShoeInfos;
};

const fetchChildrenInfos = async (
	childrenInfos: Record<string, ChildInfo>,
	children: Record<string, ShoeChild[]>
): Promise<ChildInfos> => {
	const newChildrenInfos = childrenInfos;
	const parentFetchRequests = Object.keys(children).map(async (parentKey) => {
		const childFetchRequests = children[parentKey].map(async ({ uuid }) => {
			if (!(uuid in newChildrenInfos)) {
				newChildrenInfos[uuid] = {} as ChildInfo;
				const promise = await fetch(`/api/fetchShoe/${uuid}`)
					.then((response) => response.json())
					.then((childData: ChildInfo) => {
						newChildrenInfos[uuid] = childData;
					});
				return promise;
			}
		});
		await Promise.all(childFetchRequests);
	});
	await Promise.all(parentFetchRequests);
	return newChildrenInfos;
};

interface WatchlistDisplayProps {
	shoeChildren: Record<string, ShoeChild[]> | null;
}

const WatchlistDisplay: FC<WatchlistDisplayProps> = ({
	shoeChildren
}: WatchlistDisplayProps) => {
	const { theme } = useTheme();
	const [isMounted, setMounted] = useState(true);
	useEffect(() => {
		setMounted(true);
		if (isMounted && graphRef?.current !== null) {
			if (theme === "dark") {
				GraphConfig.chart["backgroundColor"] = "#111827";
			} else {
				GraphConfig.chart["backgroundColor"] = "#FFFFFF";
			}
			graphRef.current.chart.redraw();
		}
		return () => {
			setMounted(false);
		};
	}, []);

	let activeShoes;
	if (shoeChildren !== null) {
		activeShoes = Object.keys(shoeChildren);
	} else {
		activeShoes = [];
	}
	const [[isFetchingShoes, shoeInfos], updateShoeInfos] = useState([
		true,
		{}
	]);
	const [
		[isFetchingChildren, childrenInfos],
		updateChildrenInfos
	] = useState([true, {}]);
	const [tableData, updateTableData] = useState([]);

	const processShoeInfos = async () => {
		const newShoeInfos = await fetchShoeInfos(shoeInfos, activeShoes);
		const newChildrenInfos = await fetchChildrenInfos(
			childrenInfos,
			shoeChildren
		);
		updateChildrenInfos([false, newChildrenInfos]);
		updateShoeInfos([false, newShoeInfos]);
		updateTableData(
			prepareDashboardTable(
				newShoeInfos,
				newChildrenInfos,
				activeShoes,
				shoeChildren
			)
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

	const [graphOptions, updateGraphOptions] = useState(GraphConfig);
	const graphRef = useRef(null);

	const [[graphShoe, shoeName], updateGraphShoe] = useState(["", ""]);

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
		<div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg">
			{activeShoes.length > 0 ? (
				<>
					{isFetchingShoes || isFetchingChildren ? (
						<div className="flex p-6 justify-center my-auto opacity-90">
							<GridLoader
								color={"#7C3AED"}
								loading={isFetchingShoes || isFetchingChildren}
								size={18}
								margin={6}
							/>
						</div>
					) : (
						<div className="w-full">
							<div className="bg-white dark:bg-gray-900 rounded-xl m-8 p-4">
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
