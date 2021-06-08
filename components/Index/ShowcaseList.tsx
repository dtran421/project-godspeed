import React, { FC, useState, useEffect, ReactNode } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { SkeletonThemeProps } from "react-loading-skeleton";
import _ from "lodash";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { BsCircleFill } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";

import { ShowcaseInfo } from "../../pages/api/StructureTypes";
import ListCard from "./ListCard";
import { lgScreenQuery } from "../Global/Configs/Breakpoints";

const SkeletonTheme = dynamic(
	() =>
		import("react-loading-skeleton").then((module) => module.SkeletonTheme),
	{
		ssr: false
	}
) as FC<SkeletonThemeProps>;

const MAX_CARDS_PER_PAGE = 4;

interface ShowcaseListProps {
	heading: string;
	subheading: string;
	emoji: ReactNode;
	emojiClass: string;
	list: ShowcaseInfo[];
}

const ShowcaseList: FC<ShowcaseListProps> = ({
	heading,
	subheading,
	emoji,
	emojiClass,
	list
}: ShowcaseListProps) => {
	const lgScreen = useMediaQuery(lgScreenQuery);

	const { theme } = useTheme();

	const [isGridVisible, toggleGridVisibility] = useState(true);
	const [[page, direction], setPage] = useState([0, 1]);

	const gridVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerDirection: -direction,
				staggerChildren: 0.15
			}
		}
	};

	const itemVariants = {
		hidden: (index: number) => {
			index = direction < 0 ? MAX_CARDS_PER_PAGE - index - 1 : index;
			return {
				opacity: 0,
				x: -125 * (index + 1) * direction
			};
		},
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8
			}
		}
	};

	const pageIndicators = [];
	_.times(Math.ceil(list.length / MAX_CARDS_PER_PAGE), (index) => {
		pageIndicators.push(
			<BsCircleFill
				key={index}
				size={8}
				className={`${
					page === index
						? "text-purple-500"
						: "text-gray-400 dark:text-gray-200"
				} opacity-70 mx-1`}
			/>
		);
	});

	const paginate = (newDirection: number) => {
		toggleGridVisibility(false);
		setPage([page + newDirection, newDirection]);
	};

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			setTimeout(() => {
				toggleGridVisibility(true);
			}, 1);
		}

		return () => {
			isMounted = false;
		};
	}, [isGridVisible]);

	const pageButtonClass =
		"w-10 lg:w-12 h-10 lg:h-12 z-10 flex items-center justify-center bg-white dark:bg-gray-900 shadow-md rounded-full font-bold focus:outline-none active:bg-gray-200 transition-colors duration-200 ease-in-out";
	return (
		<div className="w-full lg:max-w-4xl xl:max-w-6xl flex flex-col rounded-xl mx-auto">
			<div className="flex justify-center lg:justify-start px-14 lg:px-0 py-6 lg:ml-16">
				<div className="flex flex-col justify-center lg:justify-start">
					<h1 className="flex justify-center lg:justify-start items-center text-2xl lg:text-3xl font-bold">
						{heading}
						<span
							className={`inline-flex justify-center align-center rounded-full ml-3 p-2 bg-opacity-50 ${emojiClass}`}
						>
							{emoji}
						</span>
					</h1>
					<h2 className="lg:text-xl text-center lg:text-left font-medium text-gray-700 dark:text-gray-300">
						{subheading}
					</h2>
				</div>
			</div>
			<div className="flex mx-6 lg:mx-0">
				<div className="flex items-center mr-3">
					<button
						className={`${
							!(page > 0) && "invisible"
						} ${pageButtonClass}`}
						onClick={() => paginate(-1)}
					>
						<FiChevronLeft
							size={lgScreen ? 24 : 20}
							className="text-purple-600 dark:text-purple-400"
						/>
					</button>
				</div>
				<div className="w-full overflow-auto xl:overflow-hidden lg:flex min-h-25">
					<SkeletonTheme
						color={theme === "dark" ? "#4B5563" : "#E5E7EB"}
						highlightColor={
							theme === "dark" ? "#6B7280" : "#F3F4F6"
						}
					>
						<AnimatePresence>
							<motion.div
								className="w-full h-full flex xl:grid xl:grid-cols-4 lg:gap-x-4"
								variants={gridVariants}
								initial="hidden"
								animate={isGridVisible ? "visible" : "hidden"}
							>
								{!list.length
									? _.times(4, (index) => {
											return (
												<ListCard
													key={index}
													showcaseInfo={{
														name: "",
														uuid: "",
														urlKey: "",
														imageUrl: "",
														ticker: "",
														latestPrice: null,
														latestChange: null
													}}
												/>
											);
									  })
									: list.map((showcaseInfo, index) => {
											const minIdx =
												page * MAX_CARDS_PER_PAGE;
											if (
												index >= minIdx &&
												index <
													minIdx + MAX_CARDS_PER_PAGE
											) {
												return (
													<motion.div
														key={index}
														custom={
															index %
															MAX_CARDS_PER_PAGE
														}
														variants={itemVariants}
													>
														<ListCard
															showcaseInfo={
																showcaseInfo
															}
														/>
													</motion.div>
												);
											}
									  })}
							</motion.div>
						</AnimatePresence>
					</SkeletonTheme>
				</div>
				<div className="flex items-center ml-3">
					<button
						className={`${
							!(
								page * MAX_CARDS_PER_PAGE + MAX_CARDS_PER_PAGE <
								list.length
							) && "invisible"
						} ${pageButtonClass}`}
						onClick={() => paginate(1)}
					>
						<FiChevronRight
							size={lgScreen ? 24 : 20}
							className="text-purple-600 dark:text-purple-400"
						/>
					</button>
				</div>
			</div>
			<div className="flex justify-center m-2 mb-6 lg:m-6">
				{pageIndicators.map((indicator) => {
					return indicator;
				})}
			</div>
		</div>
	);
};

export default ShowcaseList;
