import React, { FC, useState } from "react";
import Ticker from "react-ticker";
import Link from "next/link";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

interface TickerBannerProps {
	tickers: Record<string, string | number>[];
}

const TickerBanner: FC<TickerBannerProps> = ({
	tickers
}: TickerBannerProps) => {
	const [speed, setSpeed] = useState(4);

	if (!tickers.length) return null;

	return (
		<div
			onMouseEnter={() => {
				setSpeed(0);
			}}
			onMouseLeave={() => {
				setSpeed(4);
			}}
		>
			<Ticker speed={speed} offset={"10%"}>
				{({ index }) => {
					const { urlKey, ticker, latestChange } = tickers[
						index % tickers.length
					];
					const iconProps = {
						size: 18,
						className: `mx-1 ${
							latestChange >= 0
								? "text-green-400 dark:text-green-600"
								: "text-red-500 dark:text-red-600"
						}`
					};
					return (
						<div className="mx-8 my-3">
							<Link href={`/shoe/${urlKey}`}>
								<div className="flex justify-center items-center cursor-pointer">
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
												? "text-green-400 dark:text-green-600"
												: "text-red-500 dark:text-red-600"
										}`}
									>
										{latestChange}%
									</h1>
								</div>
							</Link>
						</div>
					);
				}}
			</Ticker>
		</div>
	);
};

export default TickerBanner;
