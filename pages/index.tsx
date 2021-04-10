import React from "react";
import { useState, useEffect } from "react";
import Head from "next/head";
import PageVisibility from "react-page-visibility";
import Twemoji from "react-twemoji";

import Navbar from "../components/Global/Navbar";
import TickerBanner from "../components/Index/TickerBanner";

export interface CardInfo {
	ticker: string;
	imageUrl: string;
	colorway: string;
	releaseDate: string;
	retailPrice: number;
	latestPrice: Record<string, number>;
	latestChange: Record<string, number>;
	ytdPrice: Record<string, number>;
	volatility: number;
	meanPrice: number;
	sales: number;
}

const tickers: { ticker: string; change: number }[] = [
	{ ticker: "ABCDEF", change: -10 },
	{ ticker: "GHEIJF", change: +14 },
	{ ticker: "SLDKFJ", change: -5.13 },
	{ ticker: "12390DSF", change: +5 },
	{ ticker: "AFLK!@$", change: +10 }
];

const shoeInfos: { [id: string]: CardInfo } = {
	"air-jordan-1-retro-high-bred-toe": {
		ticker: "AJ1H-BREDTOE",
		imageUrl:
			"https://stockx-360.imgix.net/Air-Jordan-1-Retro-High-Bred-Toe/Images/Air-Jordan-1-Retro-High-Bred-Toe/Lv2/img01.jpg?auto=compress&w=559&q=90&dpr=2&updated_at=1606322598&fit=clip&fm=jpg&ixlib=react-9.0.3",
		colorway: "Gym Red/Black-Summit",
		releaseDate: "02/24/2018",
		retailPrice: 160,
		latestPrice: {
			last: 745,
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
		meanPrice: 631,
		sales: 2484
	}
};

const trendingList = [
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	},
	{
		id: "air-jordan-1-retro-high-bred-toe",
		name: "Jordan 1 Retro High Bred Toe"
	}
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

		/* const shoeInfo: CardInfo = {
			ticker: "AJ1H-BREDTOE",
			imageUrl:
				"https://stockx-360.imgix.net/Air-Jordan-1-Retro-High-Bred-Toe/Images/Air-Jordan-1-Retro-High-Bred-Toe/Lv2/img01.jpg?auto=compress&w=559&q=90&dpr=2&updated_at=1606322598&fit=clip&fm=jpg&ixlib=react-9.0.3",
			retailPrice: 160,
			latestPrice: {
				latest: 0,
				high: 0,
				low: 0
			},
			latestChange: {
				dollar: -209,
				percent: -29
			}
		}; */

		/* fetch(`https://stockx.com/${info.id}`).then((response) => {
			const spans = $(response).find("span");
			$.each(spans, (index, span) => {
				if (span.dataset.testid === "product-ticker")
					shoeInfo.ticker = span.innerHTML;
			});

			const images = $(response).find("img");
			$.each(images, (index, image) => {
				if (image.dataset.testid === "product-detail-image")
					shoeInfo.imageUrl = image.src;
			});

			// updateCard(shoeInfo);
		}); */
	}, []);

	return (
		<div className="w-full bg-gray-100">
			<Head>
				<title>Home | Godspeed</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navbar page={""} />
			<div className="w-full flex flex-col align-center">
				<div className="bg-gray-800">
					<PageVisibility onChange={handleVisibilityChange}>
						{pageIsVisible && <TickerBanner tickers={tickers} />}
					</PageVisibility>
				</div>
				<div className="flex flex-row justify-end p-10">
					<div className="h-2/3 rounded-xl shadow-lg p-4 bg-white">
						<a
							className="twitter-timeline h-screen overflow-auto"
							href="https://twitter.com/shopkickflip/lists/shoe-news-72100?ref_src=twsrc%5Etfw"
							data-width="400"
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
							{trendingList.map((shoe, index) => {
								return (
									<div
										key={index}
										className="text-center rounded-xl px-4 py-6 mx-6 w-64 bg-white shadow-lg"
									>
										<div className="flex justify-center">
											<img
												width="150"
												height="150"
												src={
													shoeInfos[shoe.id].imageUrl
												}
												className="rounded-lg mb-4"
											/>
										</div>
										<p className="text-lg font-semibold mb-3">
											{shoe.name}
										</p>
										<span className="font-semibold text-purple-500 bg-purple-100 rounded-full px-3 py-2">
											{shoeInfos[shoe.id].ticker}
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
