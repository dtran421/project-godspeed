import React, { FC, useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import { PopularStoryInfo } from "../../pages/api/StructureTypes";
import { lgScreenQuery } from "../Global/Configs/Breakpoints";

const MAX_POPULAR_STORIES = 6;
const MAX_POPULAR_STORIES_MOBILE = 3;

export interface PopularNewsProps {
	sources: [
		{
			name: string;
			link: string;
			popularStories?: PopularStoryInfo[];
		}
	];
}

const PopularNews: FC<PopularNewsProps> = ({ sources }: PopularNewsProps) => {
	const lgScreen = useMediaQuery(lgScreenQuery);

	const [maxStories, updateMaxStories] = useState(
		lgScreen ? MAX_POPULAR_STORIES : MAX_POPULAR_STORIES_MOBILE
	);
	useEffect(() => {
		updateMaxStories(
			lgScreen ? MAX_POPULAR_STORIES : MAX_POPULAR_STORIES_MOBILE
		);
	}, [lgScreen]);

	const [popularStories, updatePopularStories] = useState([]);
	useEffect(() => {
		updatePopularStories(
			sources.reduce(
				(
					popularStories,
					{ name, popularStories: sourcePopularStories }
				) => {
					if (sourcePopularStories) {
						sourcePopularStories.map((popularStory) => {
							popularStories.push({
								name,
								story: popularStory
							});
						});
					}
					return popularStories;
				},
				[]
			)
		);
	}, [sources]);

	return (
		<div className="flex flex-col md:grid grid-cols-3 md:grid-rows-2 lg:grid-rows-3 gap-x-2 gap-y-4 md:gap-y-2">
			{popularStories.map((storyInfo, index) => {
				if (index < maxStories) {
					return (
						<StoryCard key={index} index={index} {...storyInfo} />
					);
				}
			})}
		</div>
	);
};

interface StoryCardProps {
	index: number;
	name: string;
	story: PopularStoryInfo;
}

const StoryCard: FC<StoryCardProps> = ({
	index,
	story: { headline, link, imageUrl }
}: StoryCardProps) => {
	let gridStyle;
	if (index === 0) {
		gridStyle =
			"md:col-span-2 md:row-span-2 text-lg md:text-2xl lg:text-4xl";
	} else if (index >= 1 && index <= 2) {
		gridStyle = "col-span-1 row-span-1 text-lg";
	} else {
		gridStyle = "col-span-1 text-lg";
	}
	return (
		<div className={`${gridStyle} rounded-xl overflow-hidden`}>
			<a
				href={link}
				target="_blank"
				rel="noreferrer"
				className="relative flex items-center"
			>
				<img src={imageUrl} className="w-full" />
				<div
					className={`absolute top-0 left-0 w-full h-full flex items-end bg-gradient-to-t ${
						index === 0
							? "from-gray-800 md:from-gray-600 to-transparent md:via-transparent bg-opacity-90 xl:bg-opacity-50"
							: "from-gray-800 to-transparent bg-opacity-90"
					}`}
				>
					<h1
						className={`text-gray-50 dark:text-gray-100 ${
							index === 0
								? "mx-3 my-4 lg:mx-6 lg:my-8"
								: "mx-3 my-4"
						}`}
					>
						{headline}
					</h1>
				</div>
			</a>
		</div>
	);
};

export default PopularNews;
