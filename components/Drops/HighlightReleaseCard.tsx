import React from "react";
import moment from "moment";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

import { ReleaseInfo } from "../../pages/api/StructureTypes";
import { days, months } from "../../pages/drops";

import Modal from "../../components/Drops/Modal";

export interface HighlightReleaseCardProps {
	releaseInfo: ReleaseInfo;
	showBorder: boolean;
}

const HighlightReleaseCard: React.FunctionComponent<HighlightReleaseCardProps> = ({
	releaseInfo,
	showBorder
}: HighlightReleaseCardProps) => {
	const { urlKey, uuid, name, ticker, imageUrl, releaseDate, prices } = {
		...releaseInfo
	};
	const dateComponents = releaseDate.split("-");
	return (
		<div
			className={`grid grid-cols-4 ${
				showBorder && "border-b-2 border-gray-200"
			}`}
		>
			<div className="flex flex-col items-center justify-center border-r-2 border-gray-200">
				<h1 className="text-5xl font-bold uppercase">
					{days[moment(releaseDate).day()]}
				</h1>
				<h1 className="flex items-center text-xl font-medium text-gray-700">
					{`${months[dateComponents[1]]} ${dateComponents[2].replace(
						/^0+/,
						""
					)}`}
				</h1>
			</div>
			<div className="col-span-3 flex m-4">
				<img
					width="200"
					src={imageUrl}
					className="flex items-center justify-center mr-4 p-4 w-52"
				/>
				<div className="flex flex-col w-full py-2">
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
					<div className="flex mt-2">
						<div className="grid grid-cols-2 gap-x-4 w-1/2">
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
						<Modal
							name={name}
							imageUrl={imageUrl}
							type={"Highlight"}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HighlightReleaseCard;
