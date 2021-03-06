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

export const ImageCell: FC<ImageCellProps> = ({ imageUrl }: ImageCellProps) => {
	return imageUrl ? (
		<div className="flex justify-center items-center bg-white px-2 xl:mx-6 mt-1 rounded-xl">
			<img width="80" src={imageUrl} className="w-24 py-2" />
		</div>
	) : null;
};

interface ProductCellProps {
	mode: string;
	name: string;
	ticker: string;
	size: string;
}

export const ProductCell: FC<ProductCellProps> = ({
	mode,
	name,
	ticker,
	size
}: ProductCellProps) => {
	return mode === "Minimal" ? (
		<>
			{size ? (
				<div className="w-48 py-2">
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
				<div className="flex justify-center py-2">
					<p className="text-center text-lg font-semibold">
						Size {size}
					</p>
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
	format: string;
}

export const StatCell: FC<StatCellProps> = ({
	stat,
	format
}: StatCellProps) => {
	let display;
	switch (format) {
		case "dollar":
			display = `$${stat}`;
			break;
		case "percent":
			display = `${stat}%`;
			break;
		default:
			display = stat;
			break;
	}
	return (
		<p className={`text-lg text-center font-semibold align-top py-1`}>
			{display}
		</p>
	);
};

interface SpecialPriceCellProps {
	latestPrice: number;
	latestChange: number;
}

export const SpecialPriceCell: FC<SpecialPriceCellProps> = ({
	latestPrice,
	latestChange
}: SpecialPriceCellProps) => {
	return (
		<p
			className={`text-lg text-center font-semibold align-top py-1 mx-3 ${
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

export const SpecialGainCell: FC<SpecialGainCellProps> = ({
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
	parent?: string;
	shoeId: string;
	name: string;
	updateGraphShoe: Dispatch<SetStateAction<[string, string, number[]]>>;
	deleteShoe: (shoeId: string, child: boolean, parent: string) => void;
}

export const ActionCell: FC<ActionCellProps> = ({
	child,
	parent,
	shoeId,
	name,
	updateGraphShoe,
	deleteShoe
}: ActionCellProps) => {
	const [isDropdownVisible, toggleDropdown] = useState(false);

	const menuItemClass =
		"w-full text-left text-gray-600 dark:text-white font-medium rounded-md hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-600 p-2 focus:outline-none";
	return (
		<div className="relative mt-2">
			<OutsideClick updateFunction={toggleDropdown}>
				{child ? (
					<div className="flex justify-center">
						<button
							className="flex items-end rounded-lg p-1 text-red-600 dark:text-red-400 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
							onClick={() => toggleDropdown(!isDropdownVisible)}
						>
							<FiX size={20} className="opacity-80" />
						</button>
						{isDropdownVisible && (
							<div className="absolute top-8 -right-4 z-10 w-32 rounded-lg bg-white dark:bg-gray-900 shadow-lg">
								<div className="w-full flex flex-col items-center p-3">
									<p className="text-center text-red-400 font-medium pb-2">
										Are you sure?
									</p>
									<button
										className="w-full bg-red-600 text-white font-medium rounded-md py-1 focus:outline-none active:bg-red-700"
										onClick={() =>
											deleteShoe(shoeId, child, parent)
										}
									>
										Delete
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="flex justify-center">
						<button
							className="flex items-end rounded-lg p-1 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none active:bg-gray-300"
							onClick={() => toggleDropdown(!isDropdownVisible)}
						>
							<FiMoreVertical size={20} className="opacity-80" />
						</button>
						{isDropdownVisible && (
							<div className="absolute top-8 -right-4 z-10 w-44 rounded-lg bg-white dark:bg-gray-900 shadow-lg">
								<div className="w-full flex flex-col p-2">
									<button
										className={menuItemClass}
										onClick={() => {
											toggleDropdown(!isDropdownVisible);
											updateGraphShoe([shoeId, name, []]);
										}}
									>
										Graph
									</button>
									<button
										className={menuItemClass}
										onClick={() => {
											toggleDropdown(!isDropdownVisible);
											deleteShoe(shoeId, child, parent);
										}}
									>
										Remove
									</button>
								</div>
							</div>
						)}
					</div>
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
			className="flex justify-center items-center mx-4"
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
			className="flex justify-center items-center mx-4"
		>
			{row.isExpanded ? (
				<FiChevronUp size={24} />
			) : (
				<FiChevronDown size={24} />
			)}
		</div>
	) : null;
};
