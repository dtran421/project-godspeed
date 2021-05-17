import React, { FC } from "react";
import Link from "next/link";

import Modal from "../Global/Modal";
import { SearchInfo } from "../../pages/api/StructureTypes";

interface ShoeCardProps {
	searchInfo: SearchInfo;
}

const ShoeCard: FC<ShoeCardProps> = ({
	searchInfo: { urlKey, uuid, name, ticker, imageUrl, latestPrice }
}: ShoeCardProps) => {
	return (
		<div className="h-full flex flex-col justify-between rounded-xl px-4 py-6 mx-3 w-64 bg-white dark:bg-gray-900 shadow-lg ">
			<div className="relative flex flex-col">
				{/* <Modal
												name={name}
												uuid={uuid}
												urlKey={urlKey}
												imageUrl={imageUrl}
												type={"showcase"}
											/> */}
				<div className="flex justify-center bg-white rounded-lg px-2 py-1 my-4">
					<img width="175" src={imageUrl} />
				</div>
				<Link href={`/shoe/${urlKey}`}>
					<div className="cursor-pointer">
						<p className="text-lg font-semibold">{name}</p>
						<p className="inline-block font-semibold text-gray-500 dark:text-gray-300 rounded-full">
							[{ticker}]
						</p>
					</div>
				</Link>
			</div>
			<div className="flex flex-col items-start mt-4 font-semibold">
				<p className="text-gray-400 dark:text-gray-500">Latest Price</p>
				<p className="text-xl">${latestPrice}</p>
			</div>
		</div>
	);
};

export default ShoeCard;
