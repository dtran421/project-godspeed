import React, { useState, useEffect, useContext } from "react";
import { NextRouter, withRouter } from "next/router";
import Popup from "reactjs-popup";
import { X, PlusCircle } from "react-feather";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { firebase, db } from "../../pages/_app";
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

interface ModalProps {
	router: NextRouter;
	name: string;
	imageUrl: string;
	type: string;
}

const Modal: React.FunctionComponent<ModalProps> = ({
	router,
	name,
	imageUrl,
	type
}: ModalProps) => {
	const animatedSelectComponents = makeAnimated();

	const [isMounted, setMounted] = useState(true);
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);

	const {
		loggedInContext,
		fetchingListsContext,
		fetchedContext,
		watchlistsContext
	} = useContext(ModalContext);
	const [setLoggedIn] = loggedInContext;
	const [isFetchingLists, setFetchingLists] = fetchingListsContext;
	const [hasFetched, setFetched] = fetchedContext;
	const [watchlists, updateWatchlists] = watchlistsContext;

	const fetchWatchlists = (userUID) => {
		db.collection("watchlists")
			.doc(userUID)
			.get()
			.then((doc) => {
				if (doc.exists) {
					console.log("Document data:", doc.data());
					const watchlistsOptions = Object.keys(doc.data()).map(
						(watchlist) => {
							return { value: watchlist, label: watchlist };
						}
					);
					updateWatchlists(watchlistsOptions);
					setFetched(true);
					setFetchingLists(false);
				} else {
					console.log("No such document!");
				}
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	};

	const checkLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					setLoggedIn(true);
					setOpen(true);
					if (!hasFetched) {
						setFetchingLists(true);
						fetchWatchlists(user.uid);
					}
				}
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	useEffect(() => {
		setMounted(true);
		return () => {
			setMounted(false);
		};
	});

	return (
		<>
			{type === "Highlight" ? (
				<div className="flex flex-col justify-end mx-4">
					<button
						className="text-lg text-purple-500 font-semibold border-2 border-purple-500 rounded-xl px-3 py-1 hover:bg-purple-500 hover:text-white focus:outline-none"
						onClick={() => checkLoggedIn()}
					>
						Track this Shoe
					</button>
				</div>
			) : (
				<button
					className="absolute -top-5 -right-5 text-lg text-purple-500 font-semibold p-2 focus:outline-none"
					onClick={() => checkLoggedIn()}
				>
					<PlusCircle size={28} />
				</button>
			)}
			<Popup open={open} closeOnDocumentClick onClose={closeModal}>
				<div className="w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-700">
					<div className="flex flex-col bg-white rounded-lg">
						<div className="flex justify-end">
							<button
								className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
								onClick={closeModal}
							>
								<X size={28} />
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
							<Select
								closeMenuOnSelect={false}
								isLoading={isFetchingLists}
								components={animatedSelectComponents}
								placeholder={"Select a watchlist..."}
								noOptionsMessage={() => "No watchlists found."}
								isMulti
								options={watchlists}
								styles={colourStyles}
								className="w-full"
							/>
						</div>
					</div>
				</div>
			</Popup>
		</>
	);
};

export default withRouter(Modal);
