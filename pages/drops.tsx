import React, { FC, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { withRouter, NextRouter } from "next/router";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp } from "react-icons/fi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import _ from "lodash";
import Skeleton, { SkeletonThemeProps } from "react-loading-skeleton";

import { firebase, db } from "../pages/_app";
import { ModalContext } from "../components/Global/Modal";
import MainLayout from "../components/Global/Layouts/MainLayout";
import HighlightPanel from "../components/Drops/HighlightPanel";
import ReleaseCard from "../components/Drops/ReleaseCard";

const SkeletonTheme = dynamic(
	() =>
		import("react-loading-skeleton").then((module) => module.SkeletonTheme),
	{
		ssr: false
	}
) as FC<SkeletonThemeProps>;

const MAX_SHOES_PER_LINE = 4;
const MAX_SHOES_PER_LINE_TABLET = 2;
const MAX_SHOES_PER_LINE_MOBILE = 1;

export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const months = {
	"01": "Jan",
	"02": "Feb",
	"03": "Mar",
	"04": "Apr",
	"05": "May",
	"06": "Jun",
	"07": "Jul",
	"08": "Aug",
	"09": "Sep",
	"10": "Oct",
	"11": "Nov",
	"12": "Dec"
};

const showButtonVariants = {
	visible: { opacity: 1, transition: { duration: 0.5 } },
	hidden: { opacity: 0, transition: { duration: 0.3 } }
};

const prepMonth = (router) => {
	const monthQuery = router.query.month as string;
	let checkMonth = new Date().getMonth() + 1;
	if (
		monthQuery !== undefined &&
		!isNaN(checkMonth) &&
		checkMonth >= 1 &&
		checkMonth <= 12
	) {
		checkMonth = parseInt(monthQuery);
	}
	return checkMonth.toString().padStart(2, "0");
};

export interface DropsProps {
	router: NextRouter;
}

const Drops: FC<DropsProps> = ({ router }: DropsProps) => {
	const { theme } = useTheme();

	const [
		[isFetchingLists, hasFetchedLists, watchlists],
		updateWatchlists
	] = useState([true, false, []]);
	useEffect(() => {
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

		let isMounted = true;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					fetchWatchlists(user.uid);
				}
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	const [month, updateMonth] = useState(prepMonth(router));
	const [[index, releaseMonths], updateReleaseMonths] = useState([0, []]);

	const [top3List, updateTop3List] = useState([]);
	const [[isFetchingNewReleases, newReleases], updateNewReleases] = useState([
		true,
		[]
	]);

	useEffect(() => {
		const fetchNewReleases = () => {
			fetch(`/api/newReleases?month=${month}`)
				.then((response) => response.json())
				.then(
					({
						top3,
						newReleases: fetchedNewReleases,
						month: { current, index },
						releaseMonths
					}) => {
						updateTop3List(top3);
						updateNewReleases([false, fetchedNewReleases]);
						if (current !== month) {
							updateMonth(current);
						}
						updateReleaseMonths([index, releaseMonths]);
						router.push(`?month=${current}`, "/drops", {
							shallow: true
						});
					}
				);
		};

		let isMounted = true;
		if (isMounted) {
			if (router.query.month !== month) {
				updateNewReleases((newReleasesArr) => [
					true,
					newReleasesArr[1]
				]);
				fetchNewReleases();
			}
		}

		return () => {
			isMounted = false;
		};
	}, [month, router]);

	const paginate = (direction: number) => {
		const newMonth = releaseMonths[index + direction];
		updateMonth(newMonth);
		updateReleaseMonths([index + direction, releaseMonths]);
		router.push(`?month=${newMonth}`, "/drops", { shallow: true });
	};

	const [isVisibleTopButton, toggleVisibilityTopButton] = useState(false);
	const drops = useRef(null);
	useEffect(() => {
		const toggleTopButton = () => {
			if (
				drops.current &&
				drops.current.getBoundingClientRect().top < 0
			) {
				toggleVisibilityTopButton(true);
			} else {
				toggleVisibilityTopButton(false);
			}
		};

		document.addEventListener("scroll", toggleTopButton);

		return () => document.removeEventListener("scroll", toggleTopButton);
	});

	const buttonClass =
		"flex items-center text-gray-800 dark:text-gray-200 mx-4 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-700 focus:outline-none";
	const arrowProps = {
		size: 20,
		className: "stroke-1"
	};

	return (
		<SkeletonTheme
			color={theme === "dark" ? "#4B5563" : "#E5E7EB"}
			highlightColor={theme === "dark" ? "#6B7280" : "#F3F4F6"}
		>
			<MainLayout page={"Drops"} userStatus={null}>
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
					<div className="lg:max-w-4xl xl:max-w-6xl px-6 mx-auto mb-16">
						<h1 className="text-3xl md:text-4xl lg:text-5xl text-center lg:text-left font-bold mt-10 mb-6">
							Upcoming Drops
						</h1>
						<HighlightPanel top3List={top3List} />
					</div>
					<div className="sticky top-17 lg:top-18 z-20 flex justify-center w-full bg-white dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-700 p-4 mb-8">
						<div className="flex justify-between max-w-md">
							<button
								className={buttonClass}
								disabled={index === 0 || isFetchingNewReleases}
							>
								<BsChevronLeft
									{...arrowProps}
									onClick={() => paginate(-1)}
								/>
							</button>
							<p className="w-16 text-lg lg:text-xl text-center font-medium uppercase">
								{months[month.toString().padStart(2, "0")]}
							</p>
							<button
								className={buttonClass}
								disabled={
									index === releaseMonths.length - 1 ||
									isFetchingNewReleases
								}
							>
								<BsChevronRight
									{...arrowProps}
									onClick={() => paginate(1)}
								/>
							</button>
						</div>
					</div>
					<div ref={drops} className="max-w-6xl mx-auto">
						{isFetchingNewReleases
							? _.times(2, (index) => {
									return (
										<div
											key={index}
											className="lg:max-w-4xl xl:max-w-6xl mx-10 lg:mx-auto mb-4"
										>
											<h1 className="text-3xl lg:text-4xl font-bold mt-10 mb-4">
												<Skeleton width={200} />
											</h1>
											<div
												className={`grid grid-cols-${MAX_SHOES_PER_LINE_MOBILE} md:grid-cols-${MAX_SHOES_PER_LINE_TABLET} lg:grid-cols-${MAX_SHOES_PER_LINE} gap-6`}
											>
												{_.times(4, (index) => {
													return (
														<ReleaseCard
															key={index}
															releaseInfo={{
																urlKey: "",
																uuid: "",
																name: "",
																ticker: "",
																imageUrl: "",
																releaseDate: "",
																prices: null
															}}
														/>
													);
												})}
											</div>
										</div>
									);
							  })
							: Object.keys(newReleases).map(
									(releaseDate, index) => {
										const dateComponents = releaseDate.split(
											"-"
										);
										return (
											<div
												key={index}
												className="lg:max-w-4xl xl:max-w-6xl mx-10 lg:mx-auto mb-4"
											>
												<h1 className="text-3xl lg:text-4xl font-bold mt-10 mb-4">{`${
													months[dateComponents[1]]
												} ${dateComponents[2].replace(
													/^0+/,
													""
												)}`}</h1>
												<div
													className={`grid grid-cols-${MAX_SHOES_PER_LINE_MOBILE} md:grid-cols-${MAX_SHOES_PER_LINE_TABLET} lg:grid-cols-${MAX_SHOES_PER_LINE} gap-6`}
												>
													{newReleases[
														releaseDate
													].map(
														(
															releaseInfo,
															index
														) => {
															return (
																<ReleaseCard
																	key={index}
																	releaseInfo={
																		releaseInfo
																	}
																/>
															);
														}
													)}
												</div>
											</div>
										);
									}
							  )}
					</div>
					<AnimatePresence>
						{isVisibleTopButton && (
							<motion.div
								initial="hidden"
								animate="visible"
								exit="hidden"
								variants={showButtonVariants}
								className="fixed right-8 bottom-8"
							>
								<button
									className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-500 dark:bg-purple-600 focus:outline-none shadow-xl p-1"
									onClick={() =>
										window.scrollTo({
											top: 0,
											behavior: "smooth"
										})
									}
								>
									<FiChevronUp
										size={36}
										className="text-white dark:text-gray-50"
									/>
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</ModalContext.Provider>
			</MainLayout>
		</SkeletonTheme>
	);
};

export default withRouter(Drops);
