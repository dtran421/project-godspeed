import React, { useState, useEffect } from "react";
import PageVisibility from "react-page-visibility";
import Twemoji from "react-twemoji";

import { ModalContext } from "./drops";
import Navbar from "../components/Global/Navbar";
import TickerBanner from "../components/Index/TickerBanner";
import HighlightReleaseCard from "../components/Drops/HighlightReleaseCard";
import ShowcaseList from "../components/Index/ShowcaseList";

const Index: React.FunctionComponent<null> = () => {
	const [[isFetchingTickers, tickers], updateTickers] = useState([true, []]);
	const [pageIsVisible, setPageVisibility] = useState(true);
	const handleVisibilityChange = (isVisible) => {
		setPageVisibility(isVisible);
	};
	const [popularList, updatePopularList] = useState([]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch("/api/mostPopular")
				.then((response) => response.json())
				.then(({ tickers, mostPopular }) => {
					updateTickers([false, tickers]);
					updatePopularList(mostPopular);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	const [top3List, updateTop3List] = useState([]);
	const [
		[isFetchingLists, hasFetchedLists, watchlists],
		updateWatchlists
	] = useState([true, false, []]);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch(`/api/newReleases`)
				.then((response) => response.json())
				.then(({ top3 }) => {
					updateTop3List(top3);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	const [[isFetchingTrending, trendingList], updateTrendingList] = useState([
		true,
		[]
	]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch("/api/trending")
				.then((response) => response.json())
				.then(({ mostPopular }) => {
					updateTrendingList([false, mostPopular]);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	const [[isFetchingGainers, gainersList], updateGainersList] = useState([
		true,
		[]
	]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch("/api/gainers")
				.then((response) => response.json())
				.then(({ highestGainers }) => {
					updateGainersList([false, highestGainers]);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		/* const script = document.createElement("script");
		script.src = "https://platform.twitter.com/widgets.js";
		script.async = true;
		document.body.appendChild(script); */
	});

	return (
		<div className="w-full bg-gray-100 min-h-screen">
			<Navbar page={"Home"} userStatus={null} />
			{isFetchingTickers || isFetchingTrending || isFetchingGainers ? (
				<div className="flex flex-col h-screen justify-center items-center">
					<p className="text-2xl font-semibold">Loading...</p>
				</div>
			) : (
				<>
					<div className="w-full flex flex-col align-center">
						<div className="bg-gray-900">
							<PageVisibility onChange={handleVisibilityChange}>
								{pageIsVisible && (
									<TickerBanner tickers={tickers} />
								)}
							</PageVisibility>
						</div>
						<div className="flex flex-row justify-between mt-10 p-10">
							<div className="flex w-full justify-center">
								<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-16">
									{top3List.map(
										(releaseInfo, index, list) => {
											return (
												<ModalContext.Provider
													key={index}
													value={{
														watchlistsContext: [
															isFetchingLists,
															hasFetchedLists,
															watchlists,
															updateWatchlists
														]
													}}
												>
													<HighlightReleaseCard
														releaseInfo={
															releaseInfo
														}
														showBorder={
															index <
															list.length - 1
														}
													/>
												</ModalContext.Provider>
											);
										}
									)}
								</div>
							</div>
							<div className="h-2/3 rounded-xl shadow-lg p-4 bg-white">
								{/* <a
									className="twitter-timeline h-screen overflow-auto"
									href="https://twitter.com/shopkickflip/lists/shoe-news-72100?ref_src=twsrc%5Etfw"
									data-width="450"
									data-height="800"
									data-chrome="nofooter"
								>
									A Twitter List by @shopkickflip
								</a> */}
							</div>
						</div>
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
							<ShowcaseList
								name={"Trending"}
								emoji={
									<Twemoji
										options={{
											className: "emoji w-7",
											folder: "svg",
											ext: ".svg"
										}}
									>
										<span>🔥</span>
									</Twemoji>
								}
								emojiClass={"bg-yellow-200"}
								list={trendingList}
							/>
							<ShowcaseList
								name={"Popular"}
								emoji={
									<Twemoji
										options={{
											className: "emoji w-7",
											folder: "svg",
											ext: ".svg"
										}}
									>
										<span>💸</span>
									</Twemoji>
								}
								emojiClass={"bg-green-200"}
								list={popularList}
							/>
							<ShowcaseList
								name={"Gainers"}
								emoji={
									<Twemoji
										options={{
											className: "emoji w-6",
											folder: "svg",
											ext: ".svg"
										}}
									>
										<span>🚀</span>
									</Twemoji>
								}
								emojiClass={"bg-blue-200"}
								list={gainersList}
							/>
						</ModalContext.Provider>
					</div>
					<footer className={"footer"}>
						<div className="w-full flex flex-row justify-between bg-gray-400 p-5 mt-10">
							<div className="flex flex-col">
								<h1 className="text-lg font-semibold">
									Godspeed
								</h1>
							</div>
						</div>
					</footer>
				</>
			)}
		</div>
	);
};

export default Index;
