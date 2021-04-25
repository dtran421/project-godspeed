import React, { useState, useEffect, useContext } from "react";
import { NextRouter, withRouter } from "next/router";
import Popup from "reactjs-popup";
import { FiX, FiPlusCircle } from "react-icons/fi";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import MoonLoader from "react-spinners/MoonLoader";

import { firebase, db } from "../../pages/_app";
import { ChildInfo } from "../../pages/api/StructureTypes";
import { ModalContext } from "../../pages/drops";

const colors = {
	optionLabel: "#000000", // option text
	optionBgActive: "#C4B5FD", // active option (click)
	focusedBg: "#DDD6FE", // hover option
	multiLabel: "#7C3AED", // selected label text
	multiBg: "#EDE9FE", // selected label bg
	multiRemove: "#8B5CF6", // X symbole
	multiRemoveHoverBg: "#6D28D9" // hover X bg
};

const colourStyles = {
	control: (styles) => ({ ...styles, backgroundColor: "white" }),
	option: (styles, { isFocused }) => {
		return {
			...styles,
			backgroundColor: isFocused && colors.focusedBg,
			color: colors.optionLabel,
			cursor: "default",
			":active": {
				...styles[":active"],
				backgroundColor: colors.optionBgActive
			}
		};
	},
	multiValue: (styles) => {
		return {
			...styles,
			backgroundColor: colors.multiBg
		};
	},
	multiValueLabel: (styles) => ({
		...styles,
		color: colors.multiLabel
	}),
	multiValueRemove: (styles) => ({
		...styles,
		color: colors.multiRemove,
		":hover": {
			backgroundColor: colors.multiRemoveHoverBg,
			color: "white"
		}
	})
};

const saveShoeToList = async (
	uid: string,
	urlKey: string,
	selectedSizes: string[],
	selectedLists: string[]
) => {
	selectedLists.map((listName) => {
		const watchlistRef = db
			.collection("watchlists")
			.doc(uid)
			.collection("lists")
			.doc(listName);
		watchlistRef
			.get()
			.then((doc) => {
				let newSizes;
				const shoesDict = doc.data().shoes;
				if (
					doc.exists &&
					Object.keys(shoesDict).length !== 0 &&
					shoesDict[urlKey] !== undefined
				) {
					newSizes = Array.from(
						new Set([...shoesDict[urlKey], ...selectedSizes])
					);
				} else {
					newSizes = selectedSizes;
				}
				watchlistRef
					.set({ shoes: { [urlKey]: newSizes } }, { merge: true })
					.then(() => {
						console.log("Document successfully written!");
					})
					.catch((error) => {
						console.error("Error writing document: ", error);
					});
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	});
};

interface ModalProps {
	router: NextRouter;
	name: string;
	uuid: string;
	urlKey: string;
	imageUrl: string;
	type: string;
}

const Modal: React.FunctionComponent<ModalProps> = ({
	router,
	name,
	uuid,
	urlKey,
	imageUrl,
	type
}: ModalProps) => {
	const animatedSelectComponents = makeAnimated();

	const [isMounted, setMounted] = useState(true);
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);

	const { watchlistsContext } = useContext(ModalContext);
	const [
		isFetchingLists,
		hasFetchedLists,
		watchlists,
		updateWatchlists
	] = watchlistsContext;
	const fetchWatchlists = (userUID) => {
		db.collection("watchlists")
			.doc(userUID)
			.collection("lists")
			.get()
			.then((listDocs) => {
				const watchlistsOptions = [];
				listDocs.forEach((listDoc) => {
					watchlistsOptions.push({
						value: listDoc.id,
						label: listDoc.id
					});
				});
				updateWatchlists([false, true, watchlistsOptions]);
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	};

	const [[isFetchingChildren, shoeChildren], updateShoeChildren] = useState([
		true,
		[]
	]);
	const fetchShoeSizes = async (uuid) => {
		await fetch(`/api/fetchSizes/${uuid}`)
			.then((response) => response.json())
			.then((childrenData: ChildInfo[]) => {
				updateShoeChildren([
					false,
					childrenData.map(({ shoeSize, latestPrice: { last } }) => {
						return {
							value: shoeSize,
							label: shoeSize,
							rating: last
						};
					})
				]);
			});
	};

	const checkLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (isMounted) {
				if (user) {
					setOpen(true);
					if (!hasFetchedLists) {
						fetchWatchlists(user.uid);
					}
					fetchShoeSizes(uuid);
				} else {
					router.push({
						pathname: "/login",
						query: { from: router.pathname }
					});
				}
			}
		});
	};

	useEffect(() => {
		setMounted(true);
		return () => {
			setMounted(false);
		};
	});

	const [selectedSizes, setSizes] = useState([]);
	const [selectedLists, setLists] = useState([]);
	const [isSubmitting, setSubmitting] = useState(false);
	const onSave = () => {
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				if (isMounted) {
					saveShoeToList(
						user.uid,
						urlKey,
						selectedSizes,
						selectedLists
					);
					updateWatchlists([
						false,
						true,
						Array.from(new Set([...watchlists, ...selectedLists]))
					]);
					setSubmitting(false);
					setTimeout(() => {
						setOpen(false);
					}, 1500);
				}
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	let button;
	switch (type) {
		case "Highlight":
			button = (
				<div className="flex flex-col justify-end mx-4">
					<button
						className="text-lg text-purple-600 font-semibold border-2 border-purple-500 rounded-xl px-3 py-1 hover:bg-purple-500 hover:text-white focus:outline-none"
						onClick={() => checkLoggedIn()}
					>
						Track this Shoe
					</button>
				</div>
			);
			break;
		case "Showcase":
			button = (
				<button
					className="absolute -top-6 -right-4 text-lg text-purple-500 font-semibold p-2 focus:outline-none"
					onClick={() => checkLoggedIn()}
				>
					<FiPlusCircle size={26} />
				</button>
			);
			break;
		default:
			button = (
				<button
					className="absolute -top-5 -right-5 text-lg text-purple-500 font-semibold p-2 focus:outline-none"
					onClick={() => checkLoggedIn()}
				>
					<FiPlusCircle size={28} />
				</button>
			);
			break;
	}

	return (
		<>
			{button}
			<Popup open={open} closeOnDocumentClick onClose={closeModal}>
				<div className="w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-700">
					<div className="flex flex-col w-1/2 bg-white rounded-lg">
						<div className="flex justify-end">
							<button
								className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
								onClick={closeModal}
							>
								<FiX size={28} />
							</button>
						</div>
						<div className="flex flex-col items-center px-6 pb-6">
							<h1 className="text-3xl font-medium">{name}</h1>
							<img
								width="250"
								height="250"
								src={imageUrl}
								className="rounded-lg m-4"
							/>
							<div className="flex w-full grid-cols-2 gap-x-4 border-b-2 border-gray-300 pb-6">
								<Select
									closeMenuOnSelect={false}
									isLoading={isFetchingChildren}
									isSearchable={false}
									components={animatedSelectComponents}
									placeholder={"Select a size..."}
									noOptionsMessage={() => "No shoes found."}
									getOptionLabel={(option) =>
										`${option.label} — ${
											parseInt(option.rating) > 0
												? `$${option.rating}`
												: "Not reported"
										}`
									}
									getOptionValue={(option) =>
										`${option.label}`
									}
									isMulti
									options={shoeChildren}
									styles={colourStyles}
									className="w-full"
									onChange={(selectedOptions) => {
										selectedOptions = selectedOptions.map(
											(option) => option.value
										);
										setSizes(selectedOptions);
									}}
								/>
								<CreatableSelect
									closeMenuOnSelect={false}
									isLoading={isFetchingLists}
									components={animatedSelectComponents}
									placeholder={"Select a watchlist..."}
									noOptionsMessage={() =>
										"No watchlists found."
									}
									isMulti
									options={watchlists}
									styles={colourStyles}
									className="w-full"
									onChange={(selectedOptions) => {
										selectedOptions = selectedOptions.map(
											(option) => option.value
										);
										setLists(selectedOptions);
									}}
								/>
							</div>
							{isSubmitting ? (
								<div className="flex relative justify-center mt-6">
									<MoonLoader color={"#000000"} size={28} />
								</div>
							) : (
								<>
									<button
										className="rounded-lg bg-blue-500 text-white text-lg px-16 py-2 mt-6 focus:outline-none disabled:bg-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed"
										disabled={
											selectedSizes.length == 0 ||
											selectedLists.length == 0 ||
											isSubmitting
										}
										onClick={() => {
											setSubmitting(true);
											onSave();
										}}
									>
										Save
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</Popup>
		</>
	);
};

export default withRouter(Modal);
