import React, { FC, useState, useEffect } from "react";
import { GetStaticProps } from "next";
import PageVisibility from "react-page-visibility";
import Twemoji from "react-twemoji";
import { useTheme } from "next-themes";
import { TwitterTimelineEmbed } from "react-twitter-embed";

import {
	fetchSneakerNewsPopular,
	fetchSoleCollectorPopular
} from "../components/News/FetchFunctions";
import { PopularStoryInfo } from "./api/StructureTypes";
import { ModalContext } from "../components/Global/Modal";
import MainLayout from "../components/Global/Layouts/MainLayout";
import TickerBanner from "../components/Index/TickerBanner";
import PopularNews from "../components/News/PopularNews";
import HighlightPanel from "../components/Drops/HighlightPanel";
import ShowcaseList from "../components/Index/ShowcaseList";
interface IndexProps {
	sources: [
		{
			name: string;
			link: string;
			popularStories?: PopularStoryInfo[];
		}
	];
}

const Index: FC<IndexProps> = ({ sources }: IndexProps) => {
	const { theme } = useTheme();
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

	/* useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://platform.twitter.com/widgets.js";
		script.async = true;
		document.body.appendChild(script);
	}); */

	return (
		<MainLayout page={"Home"} userStatus={null}>
			{isFetchingTickers || isFetchingTrending || isFetchingGainers ? (
				<div className="flex flex-col h-screen justify-center items-center">
					<p className="text-2xl font-semibold">Loading...</p>
				</div>
			) : (
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
					<div className="w-full flex flex-col align-center">
						<div className="pt-2 bg-gray-900">
							<PageVisibility onChange={handleVisibilityChange}>
								{pageIsVisible && (
									<TickerBanner tickers={tickers} />
								)}
							</PageVisibility>
						</div>
						<div className="max-w-5xl flex items-center mt-10 mx-auto">
							<PopularNews sources={sources} />
						</div>
						<div className="flex justify-between my-10 max-w-7xl mx-auto">
							<div className="w-full max-w-4xl mr-10">
								<HighlightPanel top3List={top3List} />
							</div>
							<div className="h-2/3 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
								{/* <a
									className="twitter-timeline h-screen overflow-auto"
									href="https://twitter.com/shopkickflip/lists/shoe-news-72100?ref_src=twsrc%5Etfw"
									data-width="450"
									data-height="800"
									data-chrome="noheader nofooter noborders"
									data-theme={theme}
								/> */}
								<TwitterTimelineEmbed
									sourceType="url"
									url="https://twitter.com/shopkickflip/lists/shoe-news-72100?ref_src=twsrc%5Etfw"
									options={{
										width: "400",
										height: "700"
									}}
									theme={theme}
									noHeader={true}
									noBorders={true}
									noFooter={true}
								/>
							</div>
						</div>
						<ShowcaseList
							heading={"Trending"}
							subheading={"Hot shoes right now"}
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
							heading={"Popular"}
							subheading={"Most sales over the past 72 hours"}
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
							heading={"Gainers"}
							subheading={"Biggest gains from their retail price"}
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
					</div>
				</ModalContext.Provider>
			)}
		</MainLayout>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const SneakerNewsPopularStories = await fetchSneakerNewsPopular();
	const SoleCollectorPopularStories = await fetchSoleCollectorPopular();
	// const ComplexSneakersPopularStories = await fetchComplexSneakersPopular();

	return {
		props: {
			sources: [
				{
					name: "Sneaker News",
					link: "https://sneakernews.com/",
					popularStories: SneakerNewsPopularStories
				},
				{
					name: "Sole Collector",
					link: "https://solecollector.com/",
					popularStories: SoleCollectorPopularStories
				}
			]
		}
	};
};

export default Index;
