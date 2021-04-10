import React from "react";
import Ticker from "react-ticker";

export interface TickerBannerProps {
	tickers: Record<string, unknown>[];
}

const TickerBanner: React.FunctionComponent<TickerBannerProps> = ({
	tickers
}: TickerBannerProps) => {
	return (
		<Ticker speed={4} offset={"10%"}>
			{({ index }) => (
				<div className="flex flex-row px-8 py-2">
					<h1 className="text-2xl text-white font-semibold pr-4">
						{tickers[index % tickers.length].ticker}
					</h1>
					<h1
						className={`text-2xl ${
							tickers[index % tickers.length].change >= 0
								? "text-green-400"
								: "text-red-500"
						}`}
					>
						{tickers[index % tickers.length].change}%
					</h1>
				</div>
			)}
		</Ticker>
	);
};

export default TickerBanner;
