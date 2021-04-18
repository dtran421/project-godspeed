import React from "react";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

import { CardInfo } from "../../pages/api/StructureTypes";

interface ListCardProps {
	shoeInfo: CardInfo;
}

const ListCard: React.FunctionComponent<ListCardProps> = ({
	shoeInfo
}: ListCardProps) => {
	const {
		name,
		imageUrl,
		ticker,
		latestPrice: { market: marketPrice },
		latestChange: { percent }
	} = shoeInfo;
	const percentChange = Math.round(percent * 10000) / 100;
	const iconProps = {
		size: 16,
		className: "inline align-middle"
	};
	return (
		<div className="rounded-xl px-4 py-6 mx-3 w-56 bg-white shadow-lg border border-gray-200">
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
			<div className="flex justify-center mt-4">
				<p
					className={`inline-block align-middle text-center font-semibold rounded-full px-3 py-2 ${
						percentChange >= 0
							? "text-green-500 bg-green-100"
							: "text-red-500 bg-red-100"
					}`}
				>
					${marketPrice} (
					{percentChange >= 0 ? (
						<BsCaretUpFill {...iconProps} />
					) : (
						<BsCaretDownFill {...iconProps} />
					)}
					{percentChange}
					%)
				</p>
			</div>
		</div>
	);
};

export default ListCard;
