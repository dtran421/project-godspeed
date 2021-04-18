import React from "react";
import Ticker from "react-ticker";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

interface TickerBannerProps {
	tickers: Record<string, string | number>[];
}

const TickerBanner: React.FunctionComponent<TickerBannerProps> = ({
	tickers
}: TickerBannerProps) => {
	return (
		<Ticker speed={4} offset={"10%"}>
			{({ index }) => {
				const { ticker, latestChange } = tickers[
					index % tickers.length
				];
				const iconProps = {
					size: 18,
					className: `mx-1 ${
						latestChange >= 0 ? "text-green-400" : "text-red-500"
					}`
				};
				return (
					<div className="flex items-center px-8 py-2">
						<h1 className="text-xl text-white font-semibold mr-2">
							{ticker}
						</h1>
						{latestChange >= 0 ? (
							<BsCaretUpFill {...iconProps} />
						) : (
							<BsCaretDownFill {...iconProps} />
						)}{" "}
						<h1
							className={`text-xl align-middle ${
								latestChange >= 0
									? "text-green-400"
									: "text-red-500"
							}`}
						>
							{latestChange}%
						</h1>
					</div>
				);
			}}
		</Ticker>
	);
};

export default TickerBanner;
