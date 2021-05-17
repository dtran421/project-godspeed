import React, { FC } from "react";

import { PopularStoryInfo } from "../../pages/api/StructureTypes";

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
	const popularStories = sources.reduce(
		(sources, { name, popularStories: sourcePopularStories }) => {
			if (sourcePopularStories) {
				sourcePopularStories.forEach((popularStory) => {
					sources.push({ name, story: popularStory });
				});
			}
			return sources;
		},
		[]
	);

	return (
		<div className="grid grid-cols-3 grid-rows-3">
			{popularStories.map((storyInfo, index) => {
				return <StoryCard key={index} index={index} {...storyInfo} />;
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
		gridStyle = "col-span-2 row-span-2 text-4xl";
	} else if (index >= 1 && index <= 2) {
		gridStyle = "col-span-1 row-span-1 text-lg";
	} else {
		gridStyle = "col-span-1 text-lg";
	}
	return (
		<div className={`${gridStyle} p-1`}>
			<a
				href={link}
				target="_blank"
				rel="noreferrer"
				className="bg-white relative flex items-center rounded-xl overflow-hidden"
			>
				<img
					src={imageUrl}
					className="w-full border border-gray-300 dark:border-gray-700 border-opacity-40 shadow-md"
				/>
				<div
					className={`absolute top-0 left-0 w-full h-full flex items-end bg-gradient-to-t ${
						index === 0
							? "from-gray-600 via-transparent bg-opacity-50"
							: "from-gray-800 via-transparent bg-opacity-90"
					}`}
				>
					<h1
						className={`text-gray-50 dark:text-gray-100 ${
							index === 0 ? "mx-6 my-8" : "mx-3 my-4"
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
