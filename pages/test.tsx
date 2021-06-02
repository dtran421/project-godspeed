import React, { FC, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import makeAnimated from "react-select/animated";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

import { DashboardGraphConfig } from "../components/Global/Configs/GraphConfig";
import UserLayout from "../components/Global/Layouts/UserLayout";
import selectStyles from "../components/Global/Configs/SelectConfig";

if (typeof Highcharts === "object") {
	HighchartsExporting(Highcharts);
}

const Select = dynamic(() => import("react-select"), { ssr: false });

const Test: FC<Record<string, unknown>> = () => {
	const { theme } = useTheme();

	const animatedSelectComponents = makeAnimated();

	const {
		light: GraphConfigLight,
		dark: GraphConfigDark
	} = DashboardGraphConfig;
	const [graphOptions, updateGraphOptions] = useState(
		theme === "dark" ? GraphConfigDark : GraphConfigLight
	);
	useEffect(() => {
		const options = theme === "dark" ? GraphConfigDark : GraphConfigLight;
		options.series = [{ ...options.series[0], data: [0] }];
		updateGraphOptions(options);
	}, [theme]);

	return (
		<UserLayout page={"Test"} userStatus={null}>
			<div className="w-1/2 p-4 rounded-xl">
				{/* <Select
					instanceId={1}
					inputId={1}
					closeMenuOnSelect={false}
					isSearchable={false}
					components={animatedSelectComponents}
					placeholder={"Select a size..."}
					noOptionsMessage={() => "No shoes found."}
					getOptionLabel={(option) =>
						`${option.label} — ${
							parseInt(option.lastPrice) > 0
								? `$${option.lastPrice}`
								: "Not reported"
						}`
					}
					getOptionValue={(option) => `${option.label}`}
					isMulti
					options={[{ value: "test1" }, { value: "test2" }]}
					styles={selectStyles(theme)}
					className="w-1/4 m-4"
				/> */}
				<HighchartsReact
					highcharts={Highcharts}
					constructorType={"stockChart"}
					options={graphOptions}
					allowChartUpdate={true}
				/>
			</div>
		</UserLayout>
	);
};

export default Test;
