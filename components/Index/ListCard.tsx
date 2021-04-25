import React from "react";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

import { ShowcaseInfo } from "../../pages/api/StructureTypes";
import Modal from "../Global/Modal";

interface ListCardProps {
	showcaseInfo: ShowcaseInfo;
}

const ListCard: React.FunctionComponent<ListCardProps> = ({
	showcaseInfo
}: ListCardProps) => {
	const {
		name,
		uuid,
		urlKey,
		imageUrl,
		ticker,
		latestPrice,
		latestChange
	} = showcaseInfo;
	const percentChange = Math.round(latestChange * 10000) / 100;
	return (
		<div className="h-full flex flex-col justify-between rounded-xl px-4 py-6 mx-3 w-56 bg-white shadow-lg border border-gray-200">
			<div className="relative flex flex-col">
				<Modal
					name={name}
					uuid={uuid}
					urlKey={urlKey}
					imageUrl={imageUrl}
					type={"Showcase"}
				/>
				<div className="flex justify-center">
					<img
						width="150"
						height="150"
						src={imageUrl}
						className="rounded-lg mb-4"
					/>
				</div>
				<p className="text-lg font-semibold">{name}</p>
				<p className="inline-block font-semibold text-gray-500 rounded-full">
					{ticker}
				</p>
			</div>
			<div className="flex justify-center mt-4">
				<p
					className={`flex items-center text-center font-semibold rounded-full px-3 py-2 ${
						percentChange >= 0
							? "text-green-500 bg-green-100"
							: "text-red-500 bg-red-100"
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
		</div>
	);
};

export default ListCard;
