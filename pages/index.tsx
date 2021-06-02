import React, { FC, useState, useEffect } from "react";
import { GetStaticProps } from "next";
import { withRouter, NextRouter } from "next/router";
import PageVisibility from "react-page-visibility";
import Twemoji from "react-twemoji";

import {
	fetchSneakerNewsPopular,
	fetchSoleCollectorPopular
} from "../components/News/FetchFunctions";
import { firebase, db } from "../pages/_app";
import { PopularStoryInfo } from "./api/StructureTypes";
import { ModalContext } from "../components/Global/Modal";
import MainLayout from "../components/Global/Layouts/MainLayout";
import TickerBanner from "../components/Index/TickerBanner";
import PopularNews from "../components/News/PopularNews";
import HighlightPanel from "../components/Drops/HighlightPanel";
import ShowcaseList from "../components/Index/ShowcaseList";
interface IndexProps {
	router: NextRouter;
	sources: [
		{
			name: string;
			link: string;
			popularStories?: PopularStoryInfo[];
		}
	];
}

const Index: FC<IndexProps> = ({ router, sources }: IndexProps) => {
	const [isMounted, setMounted] = useState(true);

	const [tickers, updateTickers] = useState([]);
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
					updateTickers(tickers);
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
	const fetchWatchlists = (userUID: string) => {
		db.collection("watchlists")
			.doc(userUID)
			.collection("lists")
			.get()
			.then((listDocs) => {
				const fetchedWatchlists = [];
				listDocs.forEach((listDoc) => {
					fetchedWatchlists.push({
						value: listDoc.id,
						label: listDoc.id
					});
				});
				updateWatchlists([false, true, fetchedWatchlists]);
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	};
	useEffect(() => {
		setMounted(true);
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					fetchWatchlists(user.uid);
				}
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});

		return () => {
			setMounted(false);
		};
	}, []);

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

	const [trendingList, updateTrendingList] = useState([]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch("/api/trending")
				.then((response) => response.json())
				.then(({ mostPopular }) => {
					updateTrendingList(mostPopular);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	const [gainersList, updateGainersList] = useState([]);
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch("/api/gainers")
				.then((response) => response.json())
				.then(({ highestGainers }) => {
					updateGainersList(highestGainers);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<MainLayout page={"Home"} userStatus={null}>
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
					<div className="sticky top-16 z-20 bg-gray-900 pt-1">
						<PageVisibility onChange={handleVisibilityChange}>
							{pageIsVisible && (
								<TickerBanner tickers={tickers} />
							)}
						</PageVisibility>
					</div>
					<div className="max-w-6xl flex flex-col justify-center mx-auto mt-10">
						<h1 className="flex items-center text-5xl font-bold mb-6">
							Latest News
						</h1>
						<PopularNews sources={sources} />
					</div>
					<div className="max-w-6xl flex flex-col mx-auto my-16">
						<h1 className="flex items-center text-5xl font-bold mb-6">
							Upcoming Drops
						</h1>
						<HighlightPanel top3List={top3List} />
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

export default withRouter(Index);
