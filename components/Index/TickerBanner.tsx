import React, { FC, useState } from "react";
import Ticker from "react-ticker";
import Link from "next/link";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";

import { lgScreenQuery } from "../Global/Configs/Breakpoints";

interface TickerBannerProps {
	tickers: Record<string, string | number>[];
}

const TickerBanner: FC<TickerBannerProps> = ({
	tickers
}: TickerBannerProps) => {
	const lgScreen = useMediaQuery(lgScreenQuery);

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
						size: lgScreen ? 18 : 16,
						className: `mx-1 ${
							latestChange >= 0
								? "text-green-400 dark:text-green-600"
								: "text-red-500 dark:text-red-600"
						}`
					};
					return (
						<div className="mx-8 my-3">
							<Link href={`/shoe/${urlKey}`}>
								<div className="flex justify-center items-center text-lg xl:text-xl cursor-pointer">
									<h1 className=" text-white font-semibold mr-2">
										{ticker}
									</h1>
									{latestChange >= 0 ? (
										<BsCaretUpFill {...iconProps} />
									) : (
										<BsCaretDownFill {...iconProps} />
									)}{" "}
									<h1
										className={
											latestChange >= 0
												? "text-green-400 dark:text-green-600"
												: "text-red-500 dark:text-red-600"
										}
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
