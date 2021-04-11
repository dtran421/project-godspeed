import "react-big-calendar/lib/css/react-big-calendar.css";

import React from "react";
import { useState, useEffect } from "react";
import PageVisibility from "react-page-visibility";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Twemoji from "react-twemoji";

import Navbar from "../components/Global/Navbar";
import TickerBanner from "../components/Index/TickerBanner";

export interface CardInfo {
	name: string;
	ticker: string;
	imageUrl: string;
	colorway: string;
	releaseDate: string;
	retailPrice: number;
	latestPrice: Record<string, number>;
	latestChange: Record<string, number>;
	ytdPrice: Record<string, number>;
	volatility: number;
	avgPrice: number;
	sales: number;
}

const tickers: { ticker: string; change: number }[] = [
	{ ticker: "ABCDEF", change: -10 },
	{ ticker: "GHEIJF", change: +14 },
	{ ticker: "SLDKFJ", change: -5.13 },
	{ ticker: "12390DSF", change: +5 },
	{ ticker: "AFLK!@$", change: +10 }
];

export const shoeInfos: { [id: string]: CardInfo } = {
	"air-jordan-1-retro-high-bred-toe": {
		name: "Jordan 1 Retro High Bred Toe",
		ticker: "AJ1H-BREDTOE",
		imageUrl:
			"https://stockx-360.imgix.net/Air-Jordan-1-Retro-High-Bred-Toe/Images/Air-Jordan-1-Retro-High-Bred-Toe/Lv2/img01.jpg?auto=compress&w=559&q=90&dpr=2&updated_at=1606322598&fit=clip&fm=jpg&ixlib=react-9.0.3",
		colorway: "Gym Red/Black-Summit",
		releaseDate: "02/24/2018",
		retailPrice: 160,
		latestPrice: {
			market: 745,
			ask: 420,
			bid: 702
		},
		latestChange: {
			dollar: -209,
			percent: -29
		},
		ytdPrice: {
			high: 999,
			low: 214
		},
		volatility: 15.2,
		avgPrice: 631,
		sales: 2484
	}
};

const trendingList = [
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe"
];

const Index: React.FunctionComponent<null> = () => {
	const [pageIsVisible, setPageVisibility] = useState(true);

	const handleVisibilityChange = (isVisible) => {
		setPageVisibility(isVisible);
	};

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://platform.twitter.com/widgets.js";
		script.async = true;
		document.body.appendChild(script);
	}, []);

	const localizer = momentLocalizer(moment);

	return (
		<div className="w-full bg-gray-100">
			<Navbar page={"Home"} />
			<div className="w-full flex flex-col align-center">
				<div className="bg-gray-800">
					<PageVisibility onChange={handleVisibilityChange}>
						{pageIsVisible && <TickerBanner tickers={tickers} />}
					</PageVisibility>
				</div>
				<div className="flex flex-row justify-between p-10">
					<div className="flex w-full justify-center">
						<div className="flex items-start bg-white p-10 rounded-xl">
							<Calendar
								localizer={localizer}
								defaultDate={new Date()}
								defaultView="month"
								events={[]}
								startAccessor="start"
								endAccessor="end"
								style={{
									width: 800,
									height: 600
								}}
							/>
						</div>
					</div>
					<div className="h-2/3 rounded-xl shadow-lg p-4 bg-white">
						<a
							className="twitter-timeline h-screen overflow-auto"
							href="https://twitter.com/shopkickflip/lists/shoe-news-72100?ref_src=twsrc%5Etfw"
							data-width="450"
							data-height="800"
							data-chrome="nofooter"
						>
							A Twitter List by @shopkickflip
						</a>
					</div>
				</div>
				<div className="flex flex-col w-full justify-center">
					<div className="flex flex-col justify-center mx-auto rounded-xl p-4">
						<h1 className="flex items-center text-3xl font-bold p-6">
							TRENDING{" "}
							<span className="inline-flex justify-center align-center bg-yellow-200 rounded-full p-2 ml-3">
								<Twemoji
									options={{
										className: "emoji w-7",
										folder: "svg",
										ext: ".svg"
									}}
								>
									<span>🔥</span>
								</Twemoji>
							</span>
						</h1>
						<div className="flex flex-row">
							{trendingList.map((shoeId, index) => {
								return (
									<div
										key={index}
										className="text-center rounded-xl px-4 py-6 mx-3 w-56 bg-white shadow-lg border border-gray-200"
									>
										<div className="flex justify-center">
											<img
												width="150"
												height="150"
												src={shoeInfos[shoeId].imageUrl}
												className="rounded-lg mb-4"
											/>
										</div>
										<p className="text-lg font-semibold mb-3">
											{shoeInfos[shoeId].name}
										</p>
										<span className="font-semibold text-purple-500 bg-purple-100 rounded-full px-3 py-2">
											{shoeInfos[shoeId].ticker}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			<footer className={"footer"}>
				<div className="w-full flex flex-row justify-between bg-gray-400 p-5 mt-10">
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold">Godspeed</h1>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Index;
