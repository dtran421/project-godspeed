import React, {
	FC,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	useRef
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiX } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

import {
	SearchInfo,
	ChildInfo,
	ShoeChild,
	AddShoe
} from "../../pages/api/StructureTypes";

const dropdownVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.15
		}
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.3
		}
	}
};

interface SearchResultProps {
	searchInfo: SearchInfo;
	addShoes: AddShoe[];
	updateAddShoes: Dispatch<SetStateAction<AddShoe[]>>;
}

const SearchResult: FC<SearchResultProps> = ({
	searchInfo: { urlKey, uuid, name, ticker, imageUrl, latestPrice },
	addShoes,
	updateAddShoes
}: SearchResultProps) => {
	const [selected, setSelected] = useState(false);
	const [selectedSizes, updateSelectedSizes] = useState<ShoeChild[]>([]);
	useEffect(() => {
		if (selected) {
			updateAddShoes([
				...addShoes,
				{ shoe: urlKey, children: selectedSizes }
			]);
		} else {
			let children = [];
			if (selectedSizes.length) {
				selectedSizes.map((shoeChild) => shoeChildren.push(shoeChild));
				children = shoeChildren.sort(
					(elem1, elem2) =>
						parseFloat(elem1.size) - parseFloat(elem2.size)
				);
				updateShoeChildren([false, children]);
				updateSelectedSizes([]);
			}
			updateAddShoes(
				addShoes.reduce((newAddItems, item) => {
					if (item.shoe !== urlKey) {
						newAddItems.push({ shoe: item, children });
					}
					return newAddItems;
				}, [])
			);
		}
	}, [selected, selectedSizes]);

	const [isDropdownVisible, toggleDropdown] = useState(false);

	const [[isProcessingChildren, shoeChildren], updateShoeChildren] = useState<
		[boolean, ShoeChild[]]
	>([true, []]);
	const fetchShoeSizes = async (uuid) => {
		await fetch(`/api/fetchSizes/${uuid}`)
			.then((response) => response.json())
			.then((childrenData: ChildInfo[]) => {
				updateShoeChildren([
					false,
					childrenData.map(({ uuid, shoeSize: size }) => {
						return {
							uuid,
							size
						};
					})
				]);
			});
	};

	const onToggleDropdown = async () => {
		const newVisibility = !isDropdownVisible;
		if (newVisibility) {
			if (isProcessingChildren) {
				fetchShoeSizes(uuid);
			}
		}
		toggleDropdown(newVisibility);
	};

	const selectSize = (sizeInfo: ShoeChild) => {
		const newChildren = shoeChildren.reduce((newChildren, shoeChild) => {
			if (sizeInfo.size !== shoeChild.size) {
				newChildren.push(shoeChild);
			}
			return newChildren;
		}, []);
		updateShoeChildren([false, newChildren]);
		updateSelectedSizes(
			[...selectedSizes, sizeInfo].sort(
				(elem1, elem2) =>
					parseFloat(elem1.size) - parseFloat(elem2.size)
			)
		);
		setSelected(true);
	};

	const removeSize = (sizeInfo: ShoeChild) => {
		const newSelectedSizes = selectedSizes.reduce(
			(newSelectedSizes, shoeChild) => {
				if (sizeInfo.size !== shoeChild.size) {
					newSelectedSizes.push(shoeChild);
				}
				return newSelectedSizes;
			},
			[]
		);
		updateShoeChildren([
			false,
			[...shoeChildren, sizeInfo].sort(
				(elem1, elem2) =>
					parseFloat(elem1.size) - parseFloat(elem2.size)
			)
		]);
		updateSelectedSizes(newSelectedSizes);
	};

	const dropdownRef = useRef(null);
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	});
	const handleClickOutside = (ev) => {
		if (
			dropdownRef &&
			dropdownRef.current &&
			!dropdownRef.current.contains(ev.target)
		) {
			toggleDropdown(false);
		}
	};

	return (
		<div className="w-full h-full flex items-center focus:outline-none">
			<button
				className={`flex justify-center items-center w-6 h-6 rounded-full border-2 ${
					selected ? "dark:border-purple-700" : "dark:border-gray-700"
				} transition-colors duration-200 ease-in focus:outline-none p-1 mr-4`}
				onClick={() => setSelected(!selected)}
			>
				<div
					className={`w-3 h-3 rounded-full bg-purple-700 ${
						selected ? "opacity-100" : "opacity-0"
					} transition-opacity duration-150 ease-in`}
				/>
			</button>
			<div
				className={`w-full h-full flex items-start border-2 ${
					selected
						? "bg-gray-100 border-purple-500 dark:bg-gray-800 dark:border-purple-700"
						: "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700"
				} rounded-xl shadow-lg p-4 transition-colors duration-150 ease-out`}
			>
				<div className="bg-white rounded-xl overflow-hidden p-3 mr-4">
					<img width={125} src={imageUrl} />
				</div>
				<div className="w-full h-full flex flex-col justify-between">
					<div className="w-full flex items-start justify-between">
						<div className="flex flex-col items-start">
							<h2 className="text-lg text-left font-medium">
								{name}
							</h2>
							<p className="text-gray-700 dark:text-gray-300">
								[{ticker}]
							</p>
						</div>
						<p className="text-lg rounded-full text-purple-600 bg-purple-200 dark:text-white dark:bg-purple-600 dark:bg-opacity-80 px-3 py-1 ml-4">
							${latestPrice}
						</p>
					</div>
					<div className="flex justify-between mt-2">
						<div className="w-full flex flex-wrap mr-4 gap-x-2">
							{selectedSizes.map((shoeChild, index) => {
								return (
									<div
										key={index}
										className="flex items-center justify-between rounded-full bg-purple-700 p-1 my-1"
									>
										<p className="mx-3">{shoeChild.size}</p>
										<button
											className="bg-purple-500 hover:bg-purple-400 focus:outline-none rounded-full p-1"
											onClick={() =>
												removeSize(shoeChild)
											}
										>
											<FiX size={16} />
										</button>
									</div>
								);
							})}
						</div>
						<div className="flex items-end">
							<div ref={dropdownRef} className="relative flex">
								<button
									className="focus:outline-none"
									onClick={() => onToggleDropdown()}
								>
									<FiChevronDown size={24} />
								</button>
								<AnimatePresence>
									{isDropdownVisible && (
										<motion.div
											initial="hidden"
											animate="visible"
											exit="hidden"
											variants={dropdownVariants}
											className={`absolute top-8 right-0 z-10 ${
												isProcessingChildren
													? "flex relative justify-center p-10"
													: "w-80 grid grid-cols-6 gap-x-3 gap-y-2 p-4"
											} bg-gray-900 border-2 border-gray-800 rounded-xl shadow-lg`}
										>
											{isProcessingChildren ? (
												<ClipLoader
													color={"#7C3AED"}
													size={32}
												/>
											) : (
												shoeChildren.map(
													(shoeChild, index) => {
														return (
															<button
																key={index}
																className="flex justify-center col-span-1 rounded-lg bg-purple-600 focus:outline-none p-1"
																onClick={() =>
																	selectSize(
																		shoeChild
																	)
																}
															>
																{shoeChild.size}
															</button>
														);
													}
												)
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchResult;
