import React, { FC } from "react";

interface NewsCardProps {
	link: string;
	imageUrl: string;
	headline: string;
	postTime: string;
}

const NewsCard: FC<NewsCardProps> = ({
	link,
	imageUrl,
	headline,
	postTime
}: NewsCardProps) => {
	return (
		<div className="rounded-lg bg-white dark:bg-gray-900 overflow-hidden shadow-lg">
			<a
				href={link}
				target="_blank"
				rel="noreferrer"
				className="flex items-center"
			>
				<div
					className="w-full h-40 overflow-hidden bg-center bg-cover"
					style={{ backgroundImage: `url(${imageUrl})` }}
				/>
			</a>
			<div className="flex flex-col justify-between">
				<a href={link} target="_blank" rel="noreferrer">
					<p className="text-left font-medium mt-4 mx-4">
						{headline}
					</p>
				</a>
				<p className="text-gray-600 dark:text-gray-300 mb-4 mx-4">
					{postTime}
				</p>
			</div>
		</div>
	);
};

export default NewsCard;
