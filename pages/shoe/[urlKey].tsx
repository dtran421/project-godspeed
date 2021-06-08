import React, { FC, useState, useEffect, useCallback } from "react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Select from "react-select";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import { useMediaQuery } from "react-responsive";

import { firebase, db } from "../_app";
import selectStyles from "../../components/Global/Configs/SelectConfig";
import { ShoePageGraphConfig } from "../../components/Global/Configs/GraphConfig";
import { months } from "../drops";
import MainLayout from "../../components/Global/Layouts/MainLayout";
import { ShoeDetails, ChildInfo, ShoeChild } from "../api/StructureTypes";
import StatsPanel, { StatsObject } from "../../components/ShoePage/StatsPanel";
import SalesTable from "../../components/ShoePage/SalesTable";
import { prepareSalesTable } from "../../components/Dashboard/Table/PrepareTableData";
import Modal from "../../components/ShoePage/Modal";
import { ModalContext } from "../../components/ShoePage/Modal";
import {
	mdScreenQuery,
	lgScreenQuery,
	xlScreenQuery
} from "../../components/Global/Configs/Breakpoints";

const GridLoader = dynamic(() => import("react-spinners/GridLoader"), {
	ssr: false
});

if (typeof Highcharts === "object") {
	HighchartsExporting(Highcharts);
}

interface ShoePageProps {
	details: ShoeDetails;
	children: ChildInfo[];
	data: number[];
	shoeSales: Record<string, Record<string, string | number>[]>;
}

const ShoePage: FC<ShoePageProps> = ({
	details: {
		name,
		ticker,
		uuid,
		urlKey,
		imageUrl,
		releaseDate,
		retailPrice,
		colorway,
		condition,
		description,
		latestPrice: { last: lastPrice, bid, ask },
		latestChange: { percent },
		ytdPrice: { high, low },
		volatility,
		avgPrice,
		sales
	},
	children,
	data,
	shoeSales: { shoeSales }
}: ShoePageProps) => {
	const mdScreen = useMediaQuery(mdScreenQuery);
	const lgScreen = useMediaQuery(lgScreenQuery);
	const xlScreen = useMediaQuery(xlScreenQuery);

	const { theme } = useTheme();

	const [
		[isFetchingLists, hasFetchedLists, watchlists],
		updateWatchlists
	] = useState([true, false, []]);
	useEffect(() => {
		const fetchWatchlists = (userUID: string) => {
			db.collection("watchlists")
				.doc(userUID)
				.collection("lists")
				.get()
				.then((listDocs) => {
					const fetchedWatchlists = [];
					listDocs.forEach((listDoc) => {
						fetchedWatchlists.push({
							value: listDoc.id,
							label: listDoc.id
						});
					});
					updateWatchlists([false, true, fetchedWatchlists]);
				})
				.catch((error) => {
					console.log("Error getting document:", error);
				});
		};

		let isMounted = true;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					fetchWatchlists(user.uid);
				}
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	const [
		[isProcessingChildren, shoeChildren],
		updateShoeChildren
	] = useState([true, []]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			const shoeChildren = [{ value: {}, label: "All" }];
			for (const uuid of Object.keys(children)) {
				const { size } = children[uuid];
				shoeChildren.push({
					value: { uuid, size } as ShoeChild,
					label: size
				});
			}
			updateShoeChildren([false, shoeChildren]);
		}
		return () => {
			isMounted = false;
		};
	}, [children]);

	const dateComponents = releaseDate.split("-");
	const formattedReleaseDate = `${months[dateComponents[1]]} ${
		dateComponents[2]
	}, ${dateComponents[0]}`;

	const [stats, setStats] = useState({} as StatsObject);
	const [selectedSize, setSize] = useState<ShoeChild>({} as ShoeChild);
	useEffect(() => {
		if (selectedSize.size) {
			const {
				latestPrice: { last: lastPrice, ask, bid },
				latestChange: { percent },
				sales,
				avgPrice,
				volatility,
				ytdPrice: { high, low }
			} = children[selectedSize.uuid];

			const percentChange = Math.round(percent * 10000) / 100;

			const gain = lastPrice - retailPrice;

			setStats({
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
			});
		} else {
			const percentChange = Math.round(percent * 10000) / 100;

			const gain = lastPrice - retailPrice;
			setStats({
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
			});
		}
	}, [
		ask,
		avgPrice,
		bid,
		children,
		condition,
		high,
		lastPrice,
		low,
		percent,
		retailPrice,
		sales,
		selectedSize,
		volatility
	]);

	const {
		light: GraphConfigLight,
		dark: GraphConfigDark
	} = ShoePageGraphConfig;
	const [graphOptions, updateGraphOptions] = useState(
		theme === "dark" ? GraphConfigDark : GraphConfigLight
	);
	useEffect(() => {
		updateGraphOptions((options) => {
			return {
				...options,
				series: [{ ...options.series[0], data }]
			};
		});
	}, [data]);

	useEffect(() => {
		const options = theme === "dark" ? GraphConfigDark : GraphConfigLight;
		options.series = [{ ...options.series[0], data }];
		updateGraphOptions(options);
	}, [GraphConfigDark, GraphConfigLight, data, theme]);

	const graphRef = useCallback(
		(graph) => {
			if (graph && graph.chart) {
				if (xlScreen) {
					graph.chart.setSize(1200);
				} else if (lgScreen) {
					graph.chart.setSize(800);
				} else if (mdScreen) {
					graph.chart.setSize(600);
				} else {
					graph.chart.setSize(300);
				}
			}
		},
		[mdScreen, lgScreen, xlScreen]
	);

	return (
		<MainLayout page={name} userStatus={null}>
			<div className="w-full h-full flex justify-center items-start mt-6 lg:mt-10">
				<div className="w-full rounded-xl lg:max-w-4xl xl:max-w-7xl p-6 mx-6 lg:mx-auto">
					{isProcessingChildren ? (
						<div className="flex p-6 justify-center my-auto opacity-90">
							<GridLoader
								color={"#7C3AED"}
								loading={isProcessingChildren}
								size={18}
								margin={6}
							/>
						</div>
					) : (
						<>
							<div className="flex flex-col xl:grid xl:grid-cols-2 gap-x-10">
								<div className="flex flex-col gap-y-2">
									<h1 className="text-2xl lg:text-4xl font-semibold">
										{name}
									</h1>
									<h2 className="text-lg lg:text-2xl font-medium text-gray-700 dark:text-gray-300">
										[{ticker}]
									</h2>
								</div>
								<div className="flex justify-center lg:justify-end items-start mt-4 lg:mt-0">
									<div className="w-full flex justify-between lg:justify-end items-center">
										<ModalContext.Provider
											value={{
												watchlistsContext: [
													isFetchingLists,
													hasFetchedLists,
													watchlists,
													updateWatchlists
												]
											}}
										>
											<Modal
												name={name}
												urlKey={urlKey}
												imageUrl={imageUrl}
												shoeChild={selectedSize}
											/>
										</ModalContext.Provider>
										<div className="flex items-center">
											<p className="text-xl lg:text-2xl font-medium mr-3">
												Size{" "}
											</p>
											<div>
												<Select
													closeMenuOnSelect={true}
													isSearchable={false}
													isClearable={false}
													defaultValue={
														shoeChildren[0]
													}
													getOptionValue={(option) =>
														`${option.label}`
													}
													options={shoeChildren}
													styles={selectStyles(theme)}
													className="w-22 lg:w-24 lg:text-xl"
													onChange={(
														selectedOption
													) => {
														selectedOption =
															selectedOption.value;
														setSize(selectedOption);
													}}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="flex justify-center bg-white rounded-xl border-gray-200 shadow-lg px-2 py-1 mt-8 mb-14 lg:my-6">
									<img
										width={
											xlScreen
												? "500"
												: lgScreen
												? "400"
												: mdScreen
												? "300"
												: "200"
										}
										src={imageUrl}
										className="max-w-max"
									/>
								</div>
								<StatsPanel
									info={{
										uuid,
										urlKey,
										colorway,
										releaseDate: formattedReleaseDate,
										retailPrice
									}}
									stats={stats}
								/>
							</div>
							{description && (
								<div className="w-full bg-white dark:bg-gray-900 dark:text-gray-300 bg-opacity-50 rounded-xl shadow-lg p-8 my-6">
									<div
										className="leading-8 text-lg"
										dangerouslySetInnerHTML={{
											__html: `<p>${description.replace(
												/<br>/g,
												"<br />"
											)}</p>`
										}}
									/>
								</div>
							)}
							<div className="w-full rounded-xl bg-white dark:bg-gray-900 md:px-4 py-8 my-8">
								<h1 className="text-3xl text-center font-semibold mb-4">
									Latest Sales
								</h1>
								<div className="w-full">
									<div className="w-full flex justify-center">
										<HighchartsReact
											ref={graphRef}
											highcharts={Highcharts}
											constructorType={"stockChart"}
											options={graphOptions}
											allowChartUpdate={true}
										/>
									</div>
									<div className="w-full overflow-x-scroll xl:overflow-x-hidden">
										<SalesTable
											salesData={prepareSalesTable(
												retailPrice,
												shoeSales
											)}
										/>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	query: { urlKey }
}) => {
	const response = await fetch(
		`http://localhost:3000/api/fetchDetails/${urlKey}`
	);
	const results = await response.json();

	const uuid = results.details.uuid;
	const salesResponse = await fetch(
		`http://localhost:3000/api/sales/${uuid}`
	);
	const salesResults = await salesResponse.json();

	return {
		props: { ...results, ...salesResults }
	};
};

export default ShoePage;
