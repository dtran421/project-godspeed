import React from "react";
import { useState, useEffect } from "react";
import $ from "jquery";

export interface ShoeCardProps {
	info: Record<string, unknown>;
}

export interface CardInfo {
	ticker: string;
	imageUrl: string;
	retailPrice: number;
	latestPrice: number;
	latestChange: Record<string, number>;
}

const ShoeCard: React.FunctionComponent<ShoeCardProps> = ({
	info
}: ShoeCardProps) => {
	const [cardInfo, updateCard] = useState({
		ticker: "AJ1H-BREDTOE",
		imageUrl:
			"https://stockx-360.imgix.net/Air-Jordan-1-Retro-High-Bred-Toe/Images/Air-Jordan-1-Retro-High-Bred-Toe/Lv2/img01.jpg?auto=compress&w=559&q=90&dpr=2&updated_at=1606322598&fit=clip&fm=jpg&ixlib=react-9.0.3",
		retailPrice: 160,
		latestPrice: 500,
		latestChange: {
			dollar: -209,
			percent: -29
		}
	} as CardInfo);
	useEffect(() => {
		const shoeInfo: CardInfo = {
			ticker: "AJ1H-BREDTOE",
			imageUrl:
				"https://stockx-360.imgix.net/Air-Jordan-1-Retro-High-Bred-Toe/Images/Air-Jordan-1-Retro-High-Bred-Toe/Lv2/img01.jpg?auto=compress&w=559&q=90&dpr=2&updated_at=1606322598&fit=clip&fm=jpg&ixlib=react-9.0.3",
			retailPrice: 160,
			latestPrice: 500,
			latestChange: {
				dollar: -209,
				percent: -29
			}
		};
		$.ajax({
			type: "GET",
			url: `https://stockx.com/${info.id}`,
			crossDomain: true,
			/* xhrFields: {
				withCredentials: true
			}, */
			success: function (response) {
				const spans = $(response).find("span");
				$.each(spans, (index, span) => {
					if (span.dataset.testid === "product-ticker")
						shoeInfo.ticker = span.innerHTML;
				});

				const images = $(response).find("img");
				$.each(images, (index, image) => {
					if (image.dataset.testid === "product-detail-image")
						shoeInfo.imageUrl = image.src;
				});

				updateCard(shoeInfo);
			}
		});
	});

	return (
		<div className="flex flex-row w-full justify-center rounded-xl px-6">
			<div className="flex flex-row">
				<div className="pr-2">
					<img
						width="250"
						height="250"
						src={cardInfo.imageUrl}
						className="rounded-lg"
					/>
				</div>
				<div className="flex flex-col justify-between py-4">
					<div className="flex flex-col">
						<p className="text-2xl font-bold">{info.name}</p>
						<div className="flex flex-row justify-between">
							<p className="text-lg font-semibold text-purple-500">
								{cardInfo.ticker}
							</p>
							<p
								className={`text-lg font-semibold ${
									cardInfo.latestChange?.percent >= 0
										? "text-green-400"
										: "text-red-400"
								}`}
							>
								${cardInfo.latestPrice} (
								{cardInfo.latestChange?.percent}%)
							</p>
						</div>
					</div>
					<div>
						<p className="text-lg font-semibold text-gray-800">
							Colorway: {"Gym Red/Black-Summit"}
						</p>
						<p className="text-lg font-semibold text-gray-800">
							Release Date: {"02/24/2018"}
						</p>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-9 divide-x-2 divide-purple-400 py-10 pl-4">
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">$160</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">$420</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">$710</p>
				</div>
				<div className="flex flex-col justify-center">
					<p
						className={`text-lg text-center font-semibold ${
							500 - cardInfo.retailPrice >= 0
								? "text-green-400"
								: "text-red-400"
						}`}
					>
						${500 - cardInfo.retailPrice} (
						{Math.round(
							((500 - cardInfo.retailPrice) /
								cardInfo.retailPrice) *
								100
						) / 100}
						%)
					</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">$999</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">$214</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">15.2%</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">$631</p>
				</div>
				<div className="flex flex-col justify-center">
					<p className="text-lg text-center font-semibold">2484</p>
				</div>
			</div>
		</div>
	);
};

export default ShoeCard;
