import React, {
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	createContext,
	useContext
} from "react";
import { NextRouter, withRouter } from "next/router";
import Popup from "reactjs-popup";
import { FiX, FiPlusCircle } from "react-icons/fi";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import MoonLoader from "react-spinners/MoonLoader";

import SelectStyles from "./SelectConfig";
import { firebase, db } from "../../pages/_app";
import { ChildInfo, ShoeChild } from "../../pages/api/StructureTypes";

const saveShoeToList = async (
	uid: string,
	urlKey: string,
	selectedSizes: string[],
	selectedLists: Record<string, string>[]
) => {
	selectedLists.map(({ value: listName }) => {
		const watchlistRef = db
			.collection("watchlists")
			.doc(uid)
			.collection("lists")
			.doc(listName);
		watchlistRef
			.get()
			.then((doc) => {
				let newSizes;
				if (doc.exists) {
					const shoesDict = doc.data().shoes;
					if (
						shoesDict &&
						Object.keys(shoesDict).length &&
						shoesDict[urlKey]
					) {
						newSizes = Array.from(
							new Set([...shoesDict[urlKey], ...selectedSizes])
						);
					} else {
						newSizes = selectedSizes;
					}
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

interface ModalContextObject {
	watchlistsContext: [
		boolean,
		boolean,
		{ value: string; label: string }[],
		Dispatch<
			SetStateAction<
				[boolean, boolean, { value: string; label: string }[]]
			>
		>
	];
}

export const ModalContext = createContext({} as ModalContextObject);

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

	const {
		watchlistsContext: [
			isFetchingLists,
			hasFetchedLists,
			watchlists,
			updateWatchlists
		]
	} = useContext(ModalContext);
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
					childrenData.map(
						({ uuid, shoeSize: size, latestPrice: { last } }) => {
							return {
								value: { uuid, size } as ShoeChild,
								label: size,
								lastPrice: last
							};
						}
					)
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
		case "highlight":
			button = (
				<div className="flex flex-col justify-end mx-4">
					<button
						className="text-lg text-purple-600 dark:text-purple-400 font-semibold border-2 border-purple-500 rounded-xl px-3 py-1 hover:bg-purple-500 hover:text-white dark:hover:text-white focus:outline-none"
						onClick={() => checkLoggedIn()}
					>
						Track this Shoe
					</button>
				</div>
			);
			break;
		case "showcase":
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
					<div className="flex flex-col w-1/2 bg-white dark:bg-gray-900 rounded-lg">
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
							<div className="bg-white rounded-xl p-2 m-4">
								<img
									width="250"
									height="250"
									src={imageUrl}
									className="rounded-lg"
								/>
							</div>
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
											parseInt(option.lastPrice) > 0
												? `$${option.lastPrice}`
												: "Not reported"
										}`
									}
									getOptionValue={(option) =>
										`${option.label}`
									}
									isMulti
									options={shoeChildren}
									styles={SelectStyles}
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
									styles={SelectStyles}
									className="w-full"
									onChange={(selectedOptions) =>
										setLists(selectedOptions)
									}
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
