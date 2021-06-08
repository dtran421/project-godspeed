import React, {
	FC,
	useState,
	useEffect,
	useRef,
	createContext,
	useContext
} from "react";
import { NextRouter, withRouter } from "next/router";
import { useTheme } from "next-themes";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";
import Popup from "reactjs-popup";
import { FiX, FiPlus } from "react-icons/fi";
import MoonLoader from "react-spinners/MoonLoader";
import { useMediaQuery } from "react-responsive";

import { firebase, db } from "../../pages/_app";
import { ModalContextObject, ShoeChild } from "../../pages/api/StructureTypes";
import selectStyles from "../Global/Configs/SelectConfig";
import { lgScreenQuery } from "../../components/Global/Configs/Breakpoints";

export const ModalContext = createContext({} as ModalContextObject);

const saveShoeToList = async (
	uid: string,
	urlKey: string,
	shoeChild: ShoeChild,
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
			.then((listDoc) => {
				let newSizes = [];
				if (listDoc && listDoc.exists) {
					const shoes = listDoc.data().shoes;
					if (shoeChild.size) {
						if (urlKey in shoes) {
							newSizes = Array.from(
								new Set([...shoes[urlKey], shoeChild])
							);
						} else {
							newSizes = [shoeChild];
						}
					}
					watchlistRef
						.update({ shoes: { [urlKey]: newSizes } })
						.then(() => {
							console.log("Document successfully written!");
						})
						.catch((error) => {
							console.error("Error writing document: ", error);
						});
				} else {
					if (shoeChild.size) {
						newSizes = [shoeChild];
					}
					watchlistRef
						.set({
							shoes: { [urlKey]: newSizes },
							created: new Date()
						})
						.then(() => {
							console.log("Document successfully written!");
						})
						.catch((error) => {
							console.error("Error writing document: ", error);
						});
				}
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	});
};

interface ModalProps {
	router: NextRouter;
	name: string;
	urlKey: string;
	imageUrl: string;
	shoeChild: ShoeChild;
}

const Modal: FC<ModalProps> = ({
	router,
	name,
	urlKey,
	imageUrl,
	shoeChild
}: ModalProps) => {
	const lgScreen = useMediaQuery(lgScreenQuery);

	const { theme } = useTheme();
	const animatedSelectComponents = makeAnimated();

	const [open, setOpen] = useState(false);
	const modalRef = useRef(null);

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

	const checkLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				setOpen(true);
				if (!hasFetchedLists) {
					fetchWatchlists(user.uid);
				}
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	const [selectedLists, setLists] = useState([]);
	const [isSubmitting, setSubmitting] = useState(false);
	const onSave = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				saveShoeToList(user.uid, urlKey, shoeChild, selectedLists);
				updateWatchlists([
					false,
					true,
					Array.from(new Set([...watchlists, ...selectedLists]))
				]);
				setSubmitting(false);
				setTimeout(() => {
					setOpen(false);
				}, 1500);
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	});
	const handleClickOutside = (ev) => {
		if (
			modalRef &&
			modalRef.current &&
			!modalRef.current.contains(ev.target)
		) {
			setOpen(false);
		}
	};

	return (
		<>
			<button
				className="flex items-center lg:text-lg font-medium rounded-full border-2 border-purple-600 focus:outline-none px-3 lg:px-4 lg:mr-6"
				onClick={() => checkLoggedIn()}
			>
				<span className="h-full rounded-full mr-1 lg:mr-2">
					<FiPlus size={lgScreen ? 22 : 20} />
				</span>
				<span className="py-2">Add to Watchlist</span>
			</button>
			<Popup
				open={open}
				closeOnDocumentClick
				onClose={() => setOpen(false)}
			>
				<div className="w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-700">
					<div
						ref={modalRef}
						className="flex flex-col w-3/4 md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-900 rounded-xl"
					>
						<div className="flex justify-end">
							<button
								className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
								onClick={() => setOpen(false)}
							>
								<FiX size={28} />
							</button>
						</div>
						<div className="flex flex-col items-center px-6 pb-2 lg:pb-6">
							<h1 className="text-xl md:text-2xl lg:text-3xl text-center font-medium">
								{name}
							</h1>
							<h2 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-300 mt-1 lg:mt-2">
								{shoeChild.size ? `Size ${shoeChild.size}` : ""}
							</h2>
							<div className="bg-white rounded-xl p-2 my-4 lg:my-8">
								<img
									width="250"
									height="250"
									src={imageUrl}
									className="rounded-lg"
								/>
							</div>
							<div className="flex w-full lg:w-3/4 grid-cols-2 gap-x-4 border-b-2 border-gray-300 dark:border-gray-700 pb-6">
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
									styles={selectStyles(theme)}
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
										className="rounded-lg bg-purple-600 text-white text-lg px-16 py-2 mt-6 focus:outline-none disabled:bg-purple-800 disabled:text-gray-300 disabled:cursor-not-allowed"
										disabled={
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
