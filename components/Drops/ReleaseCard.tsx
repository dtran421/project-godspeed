import React from "react";
import Popup from "reactjs-popup";
import { X, PlusCircle } from "react-feather";

import { ReleaseInfo } from "../../pages/api/StructureTypes";

interface ReleaseCardProps {
	releaseInfo: ReleaseInfo;
}

const ReleaseCard: React.FunctionComponent<ReleaseCardProps> = ({
	releaseInfo
}: ReleaseCardProps) => {
	const { urlKey, uuid, name, ticker, imageUrl, prices } = {
		...releaseInfo
	};
	return (
		<div className="flex flex-col justify-between w-full bg-white border border-gray-300 shadow-lg rounded-xl my-6 p-6">
			<div className="relative flex justify-center p-4">
				<p className="absolute -top-5 -left-5 p-2 text-lg font-semibold">
					{prices.retail !== 0 ? `$${prices.retail}` : "Not reported"}
				</p>
				<Popup
					trigger={
						<button className="absolute -top-5 -right-5 text-lg text-purple-500 font-semibold p-2 focus:outline-none">
							<PlusCircle size={28} />
						</button>
					}
					modal
				>
					{(close) => (
						<div className="w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-700">
							<div className="flex flex-col bg-white rounded-lg">
								<div className="flex justify-end">
									<button
										className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
										onClick={() => close()}
									>
										<X size={28} />
									</button>
								</div>
								<div className="flex flex-col items-center px-6 pb-6">
									<h1 className="text-3xl font-medium">
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
				<img width="175" src={imageUrl} />
			</div>
			<div className="flex justify-between items-center mb-3">
				<div>
					<span className="inline-block text-lg font-medium">
						{name}
					</span>
					<div className="flex flex-row justify-between items-center">
						<p className="font-semibold text-gray-500">
							[{ticker}]
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<div className="w-full">
					<div className="grid grid-cols-2 gap-y-1 gap-x-2">
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
							className="w-full text-lg text-center font-semibold text-red-500 px-4 py-1 rounded-full hover:text-white hover:bg-red-500 border-2 border-red-500 hover:cursor-pointer"
						>
							${prices.ask}
						</a>
						<a
							href={`https://stockx.com/buy/${uuid}/${urlKey}`}
							target="_blank"
							rel="noreferrer"
							className="w-full text-lg text-center font-semibold text-green-500 px-4 py-1 rounded-full hover:text-white hover:bg-green-500 border-2 border-green-500 hover:cursor-pointer"
						>
							${prices.bid}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReleaseCard;
