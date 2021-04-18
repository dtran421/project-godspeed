import "react-big-calendar/lib/css/react-big-calendar.css";

import React from "react";
import { useState, useEffect } from "react";
import PageVisibility from "react-page-visibility";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Twemoji from "react-twemoji";
import { ChevronLeft, ChevronRight } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";

import { CardInfo } from "./api/StructureTypes";
import Navbar from "../components/Global/Navbar";
import TickerBanner from "../components/Index/TickerBanner";
import ListCard from "../components/Index/ListCard";

const trendingList = [
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe",
	"air-jordan-1-retro-high-bred-toe"
];

const gridVariants = {
	open: {
		transition: { staggerChildren: 0.07, delayChildren: 0.2 }
	},
	closed: {
		transition: { staggerChildren: 0.05, staggerDirection: -1 }
	}
};

const variants = {
	enter: (direction: number) => {
		return {
			x: direction * 500,
			opacity: 0
		};
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1
	},
	exit: (direction: number) => {
		return {
			zIndex: 0,
			x: direction * -500,
			opacity: 0
		};
	}
};

const Index: React.FunctionComponent<null> = () => {
	const [shoeInfos, updateShoeInfos] = useState({});
	const [fetchingShoes, updateFetchingShoes] = useState(true);

	const [tickers, updateTickers] = useState([]);
	const [fetchingTickers, updateFetchingTickers] = useState(true);
	const [pageIsVisible, setPageVisibility] = useState(true);

	const handleVisibilityChange = (isVisible) => {
		setPageVisibility(isVisible);
	};

	const MAX_CARDS_PER_PAGE = 4;
	const [[trendingPage, trendingDirection], setTrendingPage] = useState([
		0,
		0
	]);

	const paginate = (list: string, newDirection: number) => {
		setTrendingPage([trendingPage + newDirection, newDirection]);
	};

	useEffect(() => {
		/* const script = document.createElement("script");
		script.src = "https://platform.twitter.com/widgets.js";
		script.async = true;
		document.body.appendChild(script); */
		let isMounted = true;
		if (isMounted) {
			const newShoeInfos = shoeInfos;
			trendingList.forEach(async (shoe) => {
				if (!(shoe in newShoeInfos)) {
					await fetch(`/api/fetchShoe/${shoe}`)
						.then((response) => response.json())
						.then((shoeData: CardInfo) => {
							newShoeInfos[shoe] = shoeData;
						})
						.finally(() => {
							updateFetchingShoes(false);
						});
				}
			});
			updateShoeInfos(newShoeInfos);

			fetch("/api/mostPopular")
				.then((response) => response.json())
				.then(({ tickers }) => {
					updateTickers(tickers);
				})
				.finally(() => {
					updateFetchingTickers(false);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	const localizer = momentLocalizer(moment);

	return (
		<div className="w-full bg-gray-100 min-h-screen">
			<Navbar page={"Home"} userStatus={null} />
			{fetchingShoes || fetchingTickers ? (
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
						<div className="mx-auto max-w-7xl rounded-xl p-4">
							<div className="flex flex-col">
								<h1 className="flex items-center text-3xl font-bold p-6 ml-16">
									Trending{" "}
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
									<div className="flex items-center">
										<button
											className={`${
												!(trendingPage > 0) &&
												"invisible"
											} w-16 h-16 flex items-center justify-center bg-white border border-gray-200 shadow-md rounded-full text-2xl font-bold mr-3 focus:outline-none active:bg-blue-400`}
											onClick={() =>
												paginate("Trending", -1)
											}
										>
											<ChevronLeft className="text-purple-600" />
										</button>
									</div>
									<div className="flex">
										<AnimatePresence
											initial={false}
											custom={trendingDirection}
										>
											<motion.div
												className="grid grid-cols-4"
												variants={gridVariants}
												initial={{ opacity: 0 }}
												animate={{
													opacity: 1,
													transition: {
														ease: "easeInOut",
														staggerChildren: 1,
														staggerDirection: trendingDirection
													}
												}}
												layout
											>
												{trendingList.map(
													(shoeId, index) => {
														const minIdx =
															trendingPage *
															MAX_CARDS_PER_PAGE;
														if (
															index >= minIdx &&
															index <
																minIdx +
																	MAX_CARDS_PER_PAGE
														) {
															return (
																<motion.div
																	key={index}
																	custom={
																		trendingDirection
																	}
																	variants={
																		variants
																	}
																	initial="enter"
																	animate="center"
																	exit="exit"
																	transition={{
																		duration: 2,
																		x: {
																			type:
																				"spring",
																			stiffness: 300,
																			damping: 30
																		},
																		opacity: {
																			duration: 0.3
																		}
																	}}
																>
																	<ListCard
																		shoeInfo={
																			shoeInfos[
																				shoeId
																			]
																		}
																	/>
																</motion.div>
															);
														}
													}
												)}
											</motion.div>
										</AnimatePresence>
									</div>
									{
										<div className="flex items-center">
											<button
												className={`${
													!(
														trendingPage *
															MAX_CARDS_PER_PAGE +
															MAX_CARDS_PER_PAGE <
														trendingList.length
													) && "invisible"
												} w-16 h-16 flex items-center justify-center bg-white border border-gray-200 shadow-md rounded-full text-2xl font-bold ml-3 focus:outline-none active:bg-blue-400`}
												onClick={() =>
													paginate("Trending", 1)
												}
											>
												<ChevronRight className="text-purple-600" />
											</button>
										</div>
									}
								</div>
							</div>
						</div>
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
