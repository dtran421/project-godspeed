import React, { FC, Dispatch, SetStateAction, useState } from "react";
import {
	FiChevronDown,
	FiChevronUp,
	FiMoreVertical,
	FiX
} from "react-icons/fi";
import OutsideClick from "../../Global/OutsideClick";

interface ImageCellProps {
	imageUrl: string;
}

export const imageCell: FC<ImageCellProps> = ({ imageUrl }: ImageCellProps) => {
	return (
		<div className="flex items-center justify-center bg-white ml-4 mr-2 mt-1 rounded-2xl">
			<img width="80" src={imageUrl} className="py-2" />
		</div>
	);
};

interface ProductCellProps {
	mode: string;
	name: string;
	ticker: string;
	size: string;
}

export const productCell: FC<ProductCellProps> = ({
	mode,
	name,
	ticker,
	size
}: ProductCellProps) => {
	return mode === "Minimal" ? (
		<>
			{size ? (
				<div className="flex justify-center w-48 py-2">
					<p className="text-xl font-semibold">Size {size}</p>
				</div>
			) : (
				<div className="flex flex-col justify-between py-2">
					<p className="text-lg font-bold">{name}</p>
					<p className="font-semibold text-gray-500">{ticker}</p>
				</div>
			)}
		</>
	) : (
		<>
			{size ? (
				<div className="flex justify-center w-48 py-2">
					<p className="text-lg font-semibold">Size {size}</p>
				</div>
			) : (
				<div className="flex justify-center py-2 px-4">
					<p className="text-lg text-center font-bold">{ticker}</p>
				</div>
			)}
		</>
	);
};

interface StatCellProps {
	stat: string;
}

export const statCell: FC<StatCellProps> = ({ stat }: StatCellProps) => {
	return (
		<p className={`text-lg text-center font-semibold align-top py-1`}>
			{stat}
		</p>
	);
};

interface SpecialPriceCellProps {
	latestPrice: number;
	latestChange: number;
}

export const specialPriceCell: FC<SpecialPriceCellProps> = ({
	latestPrice,
	latestChange
}: SpecialPriceCellProps) => {
	return (
		<p
			className={`text-lg text-center font-semibold align-top py-1 ${
				latestChange >= 0 ? "text-green-500" : "text-red-500"
			}`}
		>
			${latestPrice} ({latestChange}
			%)
		</p>
	);
};

interface SpecialGainCellProps {
	lastPrice: number;
	retailPrice: number;
}

export const specialGainCell: FC<SpecialGainCellProps> = ({
	lastPrice,
	retailPrice
}: SpecialGainCellProps) => {
	const gain = lastPrice - retailPrice;
	return (
		<p
			className={`text-lg text-center font-semibold py-1 ${
				gain >= 0 ? "text-green-500" : "text-red-500"
			}`}
		>
			${gain} ({Math.round((gain / retailPrice) * 10000) / 100}
			%)
		</p>
	);
};

interface ActionCellProps {
	child?: boolean;
	urlKey: string;
	name: string;
}

export const actionCell: FC<ActionCellProps> = (
	{ child, urlKey, name }: ActionCellProps,
	updateGraphShoe: Dispatch<SetStateAction<string[]>>
) => {
	const [isDropdownVisible, toggleDropdown] = useState(false);

	const menuItemClass =
		"w-full text-left text-gray-600 font-medium rounded-md p-2 hover:bg-purple-100 hover:text-purple-600 focus:outline-none active:bg-purple-200";
	return (
		<div className="mt-2 mr-4">
			<OutsideClick updateFunction={toggleDropdown}>
				{child ? (
					<>
						<button
							className="flex items-end rounded-lg p-1 text-red-500 bg-gray-100 hover:bg-gray-200 focus:outline-none active:bg-gray-300 active:text-red-600"
							onClick={() => toggleDropdown(!isDropdownVisible)}
						>
							<FiX size={20} className="opacity-80" />
						</button>
						{isDropdownVisible && (
							<div className="absolute right-12 z-10 w-32 rounded-lg bg-white shadow-lg">
								<div className="w-full flex flex-col items-center p-3">
									<p className="text-center text-red-400 font-medium pb-2">
										Are you sure?
									</p>
									<button className="w-full bg-red-600 text-white font-medium rounded-md py-1 focus:outline-none active:bg-red-700">
										Delete
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<>
						<button
							className="flex items-end rounded-lg p-1 hover:bg-gray-200 focus:outline-none active:bg-gray-300"
							onClick={() => toggleDropdown(!isDropdownVisible)}
						>
							<FiMoreVertical size={20} className="opacity-80" />
						</button>
						{isDropdownVisible && (
							<div className="absolute right-12 z-10 w-44 rounded-lg bg-white shadow-lg">
								<div className="w-full flex flex-col p-2">
									<button
										className={menuItemClass}
										onClick={() => {
											toggleDropdown(!isDropdownVisible);
											updateGraphShoe([urlKey, name]);
										}}
									>
										Graph
									</button>
									<button className={menuItemClass}>
										Remove
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</OutsideClick>
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const expanderHeader = ({
	getToggleAllRowsExpandedProps,
	isAllRowsExpanded
}) => {
	return (
		<div
			{...getToggleAllRowsExpandedProps()}
			className="flex justify-center items-center"
		>
			{isAllRowsExpanded ? (
				<FiChevronUp size={24} />
			) : (
				<FiChevronDown size={24} />
			)}
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const expanderCell = ({ row }) => {
	return row.canExpand ? (
		<div
			{...row.getToggleRowExpandedProps()}
			className="flex justify-center items-center"
		>
			{row.isExpanded ? (
				<FiChevronUp size={24} />
			) : (
				<FiChevronDown size={24} />
			)}
		</div>
	) : null;
};
