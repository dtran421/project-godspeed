import React from "react";
import { ChevronsRight } from "react-feather";
import Popup from "reactjs-popup";

import { ReleaseInfo } from "../../pages/api/StructureTypes";
import { months } from "../../pages/drops";

export interface HighlightReleaseCardProps {
	releaseInfo: ReleaseInfo;
	showLines: boolean;
}

const HighlightReleaseCard: React.FunctionComponent<HighlightReleaseCardProps> = ({
	releaseInfo,
	showLines
}: HighlightReleaseCardProps) => {
	const { urlKey, uuid, name, ticker, imageUrl, releaseDate, prices } = {
		...releaseInfo
	};
	const dateComponents = releaseDate.split("-");
	return (
		<div className="grid grid-cols-3 max-w-4xl">
			<div className="flex flex-col items-end justify-center mx-6 mt-6">
				<div className="flex flex-col items-center h-full">
					<h1 className="flex items-center text-3xl font-bold text-purple-600">
						<ChevronsRight size={32} className="opacity-75" />
						{`${
							months[dateComponents[1]]
						} ${dateComponents[2].replace(/^0+/, "")}`}
					</h1>
					{showLines && (
						<div className="flex h-full border-r-4 border-purple-600 border-dashed mt-6 opacity-40" />
					)}
				</div>
			</div>
			<div className="col-span-2 flex max-w-2xl border border-gray-200 shadow-lg rounded-lg my-6">
				<div className="flex items-center p-6 w-48">
					<img width="175" src={imageUrl} />
				</div>
				<div className="flex flex-col p-5">
					<div className="flex flex-col">
						<span className="inline-block text-2xl font-medium">
							{name}
						</span>
						<div className="flex items-center">
							<p className="text-lg font-semibold text-gray-500">
								[{ticker}]&nbsp;
							</p>
							<p className="text-lg font-semibold">
								&mdash;{" "}
								{prices.retail !== 0
									? `$${prices.retail}`
									: "Not reported"}
							</p>
						</div>
					</div>
					<div className="flex">
						<div className="grid grid-cols-2 gap-y-1 gap-x-4">
							<span className="text-lg text-center font-bold text-red-500 px-4">
								ASK
							</span>
							<span className="text-lg text-center font-bold text-green-500 px-4">
								BID
							</span>
							<a
								href={`https://stockx.com/sell/${uuid}/${urlKey}`}
								target="_blank"
								rel="noreferrer"
								className="text-lg text-center font-semibold text-red-500 px-4 py-1 rounded-full hover:text-white hover:bg-red-500 border-2 border-red-500 hover:cursor-pointer"
							>
								${prices.ask}
							</a>
							<a
								href={`https://stockx.com/buy/${uuid}/${urlKey}`}
								target="_blank"
								rel="noreferrer"
								className="text-lg text-center font-semibold text-green-500 px-4 py-1 rounded-full hover:text-white hover:bg-green-500 border-2 border-green-500 hover:cursor-pointer"
							>
								${prices.bid}
							</a>
							<div />
						</div>
						<Popup
							trigger={
								<div className="flex flex-col justify-end mx-4 mb-1">
									<button className="text-lg text-purple-500 font-semibold border-2 border-purple-500 rounded-xl px-3 py-1 hover:bg-purple-500 hover:text-white focus:outline-none">
										Track this Shoe
									</button>
								</div>
							}
							modal
						>
							{(close) => (
								<div className="w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-700">
									<div className="flex flex-col bg-white rounded-xl">
										<div className="flex justify-end">
											<button
												className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
												onClick={() => close()}
											>
												X
											</button>
										</div>
										<div className="flex flex-col items-center px-6 pb-6">
											<h1 className="text-3xl font-bold">
												{name}
											</h1>
											<img
												width="250"
												height="250"
												src={imageUrl}
												className="rounded-lg m-4"
											/>
										</div>
									</div>
								</div>
							)}
						</Popup>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HighlightReleaseCard;
