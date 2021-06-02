import React, { FC } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

import { ShowcaseInfo } from "../../pages/api/StructureTypes";
import Modal from "../Global/Modal";

interface ListCardProps {
	showcaseInfo: ShowcaseInfo;
}

const ListCard: FC<ListCardProps> = ({
	showcaseInfo: {
		name,
		uuid,
		urlKey,
		imageUrl,
		ticker,
		latestPrice,
		latestChange
	}
}: ListCardProps) => {
	const percentChange = Math.round(latestChange * 10000) / 100;
	return (
		<div className="h-full flex flex-col justify-between rounded-xl px-4 py-6 mx-3 w-60 bg-white dark:bg-gray-900 shadow-lg ">
			<div className="relative flex flex-col">
				<Modal
					name={name}
					uuid={uuid}
					urlKey={urlKey}
					imageUrl={imageUrl}
					type={"showcase"}
				/>
				<div
					className={`flex justify-center ${
						imageUrl && "bg-white"
					} rounded-lg px-2 py-1 my-4`}
				>
					{!imageUrl ? (
						<Skeleton width={150} height={150} />
					) : (
						<img width="150" src={imageUrl} />
					)}
				</div>
				{!(name && ticker) ? (
					<div>
						<p className="text-lg font-semibold">
							<Skeleton count={2} />
						</p>
						<p className="inline-block font-semibold text-gray-500 dark:text-gray-300 rounded-full">
							<Skeleton width={100} />
						</p>
					</div>
				) : (
					<Link href={`/shoe/${urlKey}`}>
						<div className="cursor-pointer">
							<p className="text-lg font-semibold">{name}</p>
							<p className="inline-block font-semibold text-gray-500 dark:text-gray-300 rounded-full">
								[{ticker}]
							</p>
						</div>
					</Link>
				)}
			</div>
			{latestPrice === null ? (
				<div className="flex justify-center mt-4">
					<p
						className={`flex items-center text-center font-semibold rounded-full px-3 py-2`}
					>
						<Skeleton width={80} height={30} />
					</p>
				</div>
			) : (
				<div className="flex justify-center mt-4">
					<p
						className={`flex items-center text-center font-semibold rounded-full px-3 py-2 ${
							percentChange >= 0
								? "text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-800 dark:bg-opacity-30"
								: "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-800 dark:bg-opacity-30"
						}`}
					>
						${latestPrice} (
						{percentChange >= 0 ? (
							<BsCaretUpFill size={16} />
						) : (
							<BsCaretDownFill size={16} />
						)}
						{percentChange}
						%)
					</p>
				</div>
			)}
		</div>
	);
};

export default ListCard;
