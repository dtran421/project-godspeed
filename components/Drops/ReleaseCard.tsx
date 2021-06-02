import React, { FC } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";

import { ReleaseInfo } from "../../pages/api/StructureTypes";
import Modal from "../Global/Modal";

interface ReleaseCardProps {
	releaseInfo: ReleaseInfo;
}

const ReleaseCard: FC<ReleaseCardProps> = ({
	releaseInfo: { urlKey, uuid, name, ticker, imageUrl, prices }
}: ReleaseCardProps) => {
	return (
		<div className="flex flex-col justify-between w-full bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
			<div className="relative flex justify-center p-4">
				<p className="absolute -top-5 -left-5 p-2 text-lg font-semibold">
					{!prices ? (
						<Skeleton />
					) : prices.retail !== 0 ? (
						`$${prices.retail}`
					) : (
						"Not reported"
					)}
				</p>
				<Modal
					name={name}
					uuid={uuid}
					urlKey={urlKey}
					imageUrl={imageUrl}
					type={"normal"}
				/>
				<div
					className={`flex justify-center ${
						imageUrl && "bg-white"
					} rounded-lg px-2 py-1 mt-4 mb-2`}
				>
					{!imageUrl ? (
						<Skeleton width={150} height={150} />
					) : (
						<img width="175" src={imageUrl} />
					)}
				</div>
			</div>
			<div className="flex justify-between items-center mb-3">
				<div>
					<span className="inline-block text-lg font-medium">
						{name || <Skeleton count={2} width={200} />}
					</span>
					<div className="flex flex-row justify-between items-center">
						<p className="font-semibold text-gray-500 dark:text-gray-300">
							{!ticker ? <Skeleton width={115} /> : `[${ticker}]`}
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="w-full">
					<div className="grid grid-cols-2 gap-x-2">
						<div className="flex items-center justify-center">
							<BsCaretDownFill
								size={16}
								className="inline align-middle text-red-500"
							/>
							<p className="text-lg text-center font-bold text-red-500 px-1">
								ASK
							</p>
						</div>
						<div className="flex items-center justify-center">
							<BsCaretUpFill
								size={16}
								className="inline align-middle text-green-500"
							/>
							<p className="text-lg text-center font-bold text-green-500 px-1">
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
								className="w-full text-lg text-center font-semibold text-red-500 px-4 py-1 rounded-full hover:text-white hover:bg-red-500 border-2 border-red-500 hover:cursor-pointer"
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
								className="w-full text-lg text-center font-semibold text-green-500 px-4 py-1 rounded-full hover:text-white hover:bg-green-500 border-2 border-green-500 hover:cursor-pointer"
							>
								${prices.bid}
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReleaseCard;
