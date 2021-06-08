import React, { FC } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import moment from "moment";
import Skeleton, { SkeletonThemeProps } from "react-loading-skeleton";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

import { ReleaseInfo } from "../../pages/api/StructureTypes";
import { days, months } from "../../pages/drops";

import Modal from "../Global/Modal";

const SkeletonTheme = dynamic(
	() =>
		import("react-loading-skeleton").then((module) => module.SkeletonTheme),
	{
		ssr: false
	}
) as FC<SkeletonThemeProps>;
export interface HighlightReleaseCardProps {
	releaseInfo: ReleaseInfo;
	showBorder: boolean;
}

const HighlightReleaseCard: FC<HighlightReleaseCardProps> = ({
	releaseInfo: { urlKey, uuid, name, ticker, imageUrl, releaseDate, prices },
	showBorder
}: HighlightReleaseCardProps) => {
	const { theme } = useTheme();

	const dateComponents = releaseDate.split("-");
	return (
		<SkeletonTheme
			color={theme === "dark" ? "#4B5563" : "#E5E7EB"}
			highlightColor={theme === "dark" ? "#6B7280" : "#F3F4F6"}
		>
			<div
				className={`flex flex-col items-center md:grid md:grid-cols-5 lg:grid-cols-4 ${
					showBorder &&
					"border-b-2 border-gray-200 dark:border-gray-700 mb-6"
				}`}
			>
				<div className="col-span-1 flex flex-col items-center justify-center">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase">
						{!releaseDate ? (
							<Skeleton width={100} height={60} />
						) : (
							days[moment(releaseDate).day()]
						)}
					</h1>
					<h1 className="flex items-center text-lg md:text-2xl lg:text-xl font-medium text-gray-700 dark:text-gray-300">
						{!releaseDate ? (
							<Skeleton width={40} height={20} />
						) : (
							`${
								months[dateComponents[1]]
							} ${dateComponents[2].replace(/^0+/, "")}`
						)}
					</h1>
				</div>
				<div
					className={`md:hidden w-2/3 flex justify-center ${
						imageUrl && "bg-white"
					} rounded-xl mt-4`}
				>
					{!imageUrl ? (
						<Skeleton width={150} height={150} />
					) : (
						<img
							width="175"
							src={imageUrl}
							className="w-48 flex items-center justify-center"
						/>
					)}
				</div>
				<div className="md:col-span-4 lg:col-span-3 flex m-4">
					<div
						className={`hidden md:flex items-center ${
							imageUrl && "bg-white"
						} rounded-xl mr-4 px-3`}
					>
						{!imageUrl ? (
							<Skeleton width={150} height={150} />
						) : (
							<img
								width="175"
								src={imageUrl}
								className="w-48 flex items-center justify-center"
							/>
						)}
					</div>
					<div className="flex flex-col w-full py-2">
						{!(name && ticker && prices) ? (
							<div className="flex flex-col cursor-pointer">
								<span className="inline-block text-lg md:text-xl lg:text-2xl font-medium">
									<Skeleton width={350} />
								</span>
								<div className="flex items-center">
									<p className="text-sm md:text-md lg:text-lg font-semibold text-gray-500 dark:text-gray-300">
										<Skeleton width={125} />
										&nbsp;
									</p>
									<p className="text-sm md:text-md lg:text-lg font-semibold">
										&mdash; <Skeleton width={50} />
									</p>
								</div>
							</div>
						) : (
							<Link href={`/shoe/${urlKey}`}>
								<div className="flex flex-col cursor-pointer">
									<span className="inline-block text-lg md:text-xl lg:text-2xl font-medium">
										{name}
									</span>
									<div className="flex items-center">
										<p className="text-sm md:text-md lg:text-lg font-semibold text-gray-500 dark:text-gray-300">
											[{ticker}]&nbsp;
										</p>
										<p className="text-sm md:text-md lg:text-lg font-semibold">
											&mdash;{" "}
											{prices.retail !== 0
												? `$${prices.retail}`
												: "Not reported"}
										</p>
									</div>
								</div>
							</Link>
						)}
						<div className="flex flex-col md:flex-row items-center md:justify-start mt-2">
							<div className="w-3/4 md:w-1/2 grid grid-cols-2 gap-x-4">
								<div className="flex items-center justify-center">
									<BsCaretDownFill
										size={16}
										className="inline align-middle text-red-500"
									/>
									<p className="text-sm md:text-md lg:text-lg text-center font-bold text-red-500 px-1">
										ASK
									</p>
								</div>
								<div className="flex items-center justify-center">
									<BsCaretUpFill
										size={16}
										className="inline align-middle text-green-500"
									/>
									<p className="text-sm md:text-md lg:text-lg text-center font-bold text-green-500 px-1">
										BID
									</p>
								</div>
								{!prices ? (
									<Skeleton height={25} />
								) : (
									<a
										href={`https://stockx.com/sell/${uuid}/${urlKey}`}
										target="_blank"
										rel="noreferrer"
										className="text-sm md:text-md lg:text-lg text-center font-semibold text-red-500 px-2 md:px-4 py-1 rounded-full hover:text-white hover:bg-red-500 border-2 border-red-500 hover:cursor-pointer"
									>
										${prices.ask}
									</a>
								)}
								{!prices ? (
									<Skeleton height={25} />
								) : (
									<a
										href={`https://stockx.com/buy/${uuid}/${urlKey}`}
										target="_blank"
										rel="noreferrer"
										className="text-sm md:text-md lg:text-lg text-center font-semibold text-green-500 px-2 md:px-4 py-1 rounded-full hover:text-white hover:bg-green-500 border-2 border-green-500 hover:cursor-pointer"
									>
										${prices.bid}
									</a>
								)}
								<div />
							</div>
							<Modal
								name={name}
								uuid={uuid}
								urlKey={urlKey}
								imageUrl={imageUrl}
								type={"highlight"}
							/>
						</div>
					</div>
				</div>
			</div>
		</SkeletonTheme>
	);
};

export default HighlightReleaseCard;
