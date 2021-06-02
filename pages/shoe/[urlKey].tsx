import React, { FC, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Select from "react-select";
import GridLoader from "react-spinners/GridLoader";
import { useTheme } from "next-themes";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

import selectStyles from "../../components/Global/Configs/SelectConfig";
import { ShoePageGraphConfig } from "../../components/Global/Configs/GraphConfig";
import { months } from "../drops";
import MainLayout from "../../components/Global/Layouts/MainLayout";
import { ShoeDetails, ChildInfo, ShoeChild } from "../api/StructureTypes";
import StatsPanel, { StatsObject } from "../../components/ShoePage/StatsPanel";
import SalesTable from "../../components/ShoePage/SalesTable";
import { prepareSalesTable } from "../../components/Dashboard/Table/PrepareTableData";
import { FiPlus } from "react-icons/fi";

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
	const { theme } = useTheme();

	const [
		[isProcessingChildren, shoeChildren],
		updateShoeChildren
	] = useState([true, []]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			const shoeChildren = [{ value: { uuid, size: "0" }, label: "All" }];
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
	}, []);

	const dateComponents = releaseDate.split("-");
	const formattedReleaseDate = `${months[dateComponents[1]]} ${
		dateComponents[2]
	}, ${dateComponents[0]}`;

	const [stats, setStats] = useState({} as StatsObject);
	const [selectedSize, setSize] = useState({ uuid, size: "0" });
	useEffect(() => {
		if (selectedSize.size === "0") {
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
		}
	}, [selectedSize]);

	const {
		light: GraphConfigLight,
		dark: GraphConfigDark
	} = ShoePageGraphConfig;
	const [graphOptions, updateGraphOptions] = useState(
		theme === "dark" ? GraphConfigDark : GraphConfigLight
	);
	useEffect(() => {
		updateGraphOptions({
			...graphOptions,
			series: [{ ...graphOptions.series[0], data }]
		});
	}, []);

	useEffect(() => {
		const options = theme === "dark" ? GraphConfigDark : GraphConfigLight;
		options.series = [{ ...options.series[0], data }];
		updateGraphOptions(options);
	}, [theme]);

	return (
		<MainLayout page={name} userStatus={null}>
			<div className="h-full flex justify-center items-start mt-10">
				<div className="rounded-xl p-6 max-w-7xl">
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
						<div className="max-w-7xl">
							<div className="grid grid-cols-2 gap-x-10">
								<div className="flex flex-col gap-y-2">
									<h1 className="text-4xl font-semibold">
										{name}
									</h1>
									<h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
										[{ticker}]
									</h2>
								</div>
								<div className="flex justify-end items-start">
									<div className="flex items-center">
										<button className="flex items-center text-lg font-medium rounded-full border-2 border-purple-600 focus:outline-none px-4 mr-6">
											<span className="h-full rounded-full mr-2">
												<FiPlus size={22} />
											</span>
											<span className="py-2">
												Add to Watchlist
											</span>
										</button>
										<p className="text-2xl font-medium mr-3">
											Size{" "}
										</p>
										<div>
											<Select
												closeMenuOnSelect={true}
												isSearchable={false}
												isClearable={false}
												defaultValue={shoeChildren[0]}
												getOptionValue={(option) =>
													`${option.label}`
												}
												options={shoeChildren}
												styles={selectStyles(theme)}
												className="w-24 text-xl"
												onChange={(selectedOption) => {
													selectedOption =
														selectedOption.value;
													setSize(selectedOption);
												}}
											/>
										</div>
									</div>
								</div>
								<div className="flex justify-center bg-white rounded-xl border-gray-200 shadow-lg px-2 py-1 my-6">
									<img width="500" src={imageUrl} />
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
							<div className="w-full flex flex-col justify-center items-center bg-white dark:bg-gray-900 rounded-xl p-8 my-8">
								<h1 className="text-3xl font-semibold mb-4">
									Latest Sales
								</h1>
								<HighchartsReact
									highcharts={Highcharts}
									constructorType={"stockChart"}
									options={graphOptions}
									allowChartUpdate={true}
								/>
								<SalesTable
									salesData={prepareSalesTable(
										retailPrice,
										shoeSales
									)}
								/>
							</div>
						</div>
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
