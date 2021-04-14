import React from "react";

interface ListCardProps {
	index: number;
	name: string;
	imageUrl: string;
	ticker: string;
	marketPrice: number;
	percentChange: number;
}

const ListCard: React.FunctionComponent<ListCardProps> = ({
	index,
	name,
	imageUrl,
	ticker,
	marketPrice,
	percentChange
}: ListCardProps) => {
	const latestChange = Math.round(percentChange * 10000) / 100;
	return (
		<div
			key={index}
			className="rounded-xl px-4 py-6 mx-3 w-56 bg-white shadow-lg border border-gray-200"
		>
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
					className={`inline-block font-semibold rounded-full px-3 py-2 ${
						latestChange >= 0
							? "text-green-500 bg-green-100"
							: "text-red-500 bg-red-100"
					}`}
				>
					${marketPrice} ({latestChange}
					%)
				</p>
			</div>
		</div>
	);
};

export default ListCard;
