import React, { useState, useEffect, ReactNode } from "react";
import _ from "lodash";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { BsCircleFill } from "react-icons/bs";

import { ShowcaseInfo } from "../../pages/api/StructureTypes";
import ListCard from "./ListCard";

interface ShowcaseListProps {
	heading: string;
	subheading: string;
	emoji: ReactNode;
	emojiClass: string;
	list: ShowcaseInfo[];
}

const ShowcaseList: React.FunctionComponent<ShowcaseListProps> = ({
	heading,
	subheading,
	emoji,
	emojiClass,
	list
}: ShowcaseListProps) => {
	const MAX_CARDS_PER_PAGE = 4;
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
		"z-10 w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-900 shadow-md rounded-full text-2xl font-bold mr-3 focus:outline-none active:bg-gray-200 transition-colors duration-200 ease-in-out";
	return (
		<div className="flex flex-col mx-auto max-w-7xl rounded-xl">
			<div className="p-6 ml-16">
				<h1 className="flex items-center text-3xl font-bold">
					{heading}
					<span
						className={`inline-flex justify-center align-center rounded-full ml-3 p-2 bg-opacity-50 ${emojiClass}`}
					>
						{emoji}
					</span>
				</h1>
				<h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
					{subheading}
				</h2>
			</div>
			<div className="flex">
				<div className="flex items-center">
					<button
						className={`${
							!(page > 0) && "invisible"
						} ${pageButtonClass}`}
						onClick={() => paginate(-1)}
					>
						<FiChevronLeft className="text-purple-600 dark:text-purple-400" />
					</button>
				</div>
				<div className="flex min-h-23">
					<AnimatePresence>
						<motion.div
							className="grid grid-cols-4"
							variants={gridVariants}
							initial="hidden"
							animate={isGridVisible ? "visible" : "hidden"}
						>
							{list.map((showcaseInfo, index) => {
								const minIdx = page * MAX_CARDS_PER_PAGE;
								if (
									index >= minIdx &&
									index < minIdx + MAX_CARDS_PER_PAGE
								) {
									return (
										<motion.div
											key={index}
											custom={index % MAX_CARDS_PER_PAGE}
											variants={itemVariants}
										>
											<ListCard
												showcaseInfo={showcaseInfo}
											/>
										</motion.div>
									);
								}
							})}
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="flex items-center">
					<button
						className={`${
							!(
								page * MAX_CARDS_PER_PAGE + MAX_CARDS_PER_PAGE <
								list.length
							) && "invisible"
						} ${pageButtonClass}`}
						onClick={() => paginate(1)}
					>
						<FiChevronRight className="text-purple-600 dark:text-purple-400" />
					</button>
				</div>
			</div>
			<div className="flex justify-center m-6">
				{pageIndicators.map((indicator) => {
					return indicator;
				})}
			</div>
		</div>
	);
};

export default ShowcaseList;
