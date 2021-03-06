import React, { FC, useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { FiSearch, FiX } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";

import { firebase, db } from "../../pages/_app";
import { DashboardModalContext } from "../../pages/dashboard";
import { AddShoe, SearchInfo, ShoeChild } from "../../pages/api/StructureTypes";
import SearchResult from "./SearchResult";
import { ListSchema } from "../Global/Configs/ValidationSchema";
import { Error } from "./WatchlistList";
import { lgScreenQuery } from "../Global/Configs/Breakpoints";

const RESULTS_PER_BATCH = 6;

export const AddModal: FC<Record<string, unknown>> = () => {
	const router = useRouter();

	const lgScreen = useMediaQuery(lgScreenQuery);

	const {
		listName,
		watchlists,
		watchlistsData,
		updateWatchlists,
		setOpenModal
	} = useContext(DashboardModalContext);

	const modalRef = useRef(null);
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
			setOpenModal("");
		}
	};

	const [searchValue, updateSearchValue] = useState("");
	const [searchInfos, updateSearchInfos] = useState<SearchInfo[]>([]);
	const [[numResults, page], updateResults] = useState([0, 1]);
	const search = async (initialSearch: boolean) => {
		let searchPage = page;
		// TODO: implement maximum at 1000 numResults
		if (!initialSearch) {
			searchPage = page + 1;
		}
		await fetch(`/api/search?query=${searchValue}&page=${searchPage}`)
			.then((response) => response.json())
			.then((results) => {
				if (initialSearch) {
					updateSearchInfos(results.shoes);
					updateResults([RESULTS_PER_BATCH, 1]);
				} else {
					updateSearchInfos([...searchInfos, ...results.shoes]);
					updateResults([numResults + RESULTS_PER_BATCH, page]);
				}
			});
	};

	const loadMoreResults = () => {
		const newResults = numResults + RESULTS_PER_BATCH;
		if (newResults <= 20 * page) {
			updateResults([newResults, page]);
		} else {
			search(false);
		}
	};

	const updateWatchlistsAfterAdd = (
		listShoes: Record<string, ShoeChild[]>
	) => {
		const newListData = watchlistsData[listName];
		newListData.shoes = listShoes;
		updateWatchlists([
			false,
			watchlists,
			{ ...watchlistsData, [listName]: newListData }
		]);
		setOpenModal("");
	};

	const [addShoes, updateAddShoes] = useState<AddShoe[]>([]);
	const addToWatchlist = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const watchlistRef = db
					.collection("watchlists")
					.doc(user.uid)
					.collection("lists")
					.doc(listName);
				watchlistRef.get().then((listDoc) => {
					if (listDoc && listDoc.exists) {
						const listShoes = listDoc.data().shoes;
						addShoes.map(({ shoe, children }) => {
							if (!(shoe in listShoes)) {
								listShoes[shoe] = children;
							} else {
								listShoes[shoe] = Array.from(
									new Set([...listShoes[shoe], ...children])
								);
							}
						});
						watchlistRef
							.update({ shoes: listShoes })
							.then(() => {
								console.log("Document successfully written!");
								updateWatchlistsAfterAdd(listShoes);
							})
							.catch((error) => {
								`Error writing document: ${error}`;
							});
					} else {
						console.log("Something went wrong!");
					}
				});
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	return (
		<div
			ref={modalRef}
			className={`w-3/4 lg:w-3/5 ${
				numResults && searchInfos.length && "h-full"
			} flex flex-col bg-white dark:bg-gray-900 bg-opacity-100 rounded-xl`}
		>
			<div className="flex justify-end">
				<button
					className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
					onClick={() => setOpenModal("")}
				>
					<FiX size={28} />
				</button>
			</div>
			<div className="w-full h-full flex flex-col items-center px-6 lg:px-12 mt-2 lg:mb-8">
				<h1 className="text-2xl lg:text-3xl text-center font-semibold mb-6">
					Add to Watchlist
				</h1>
				<div className="w-full xl:w-3/4 flex flex-col lg:flex-row items-center gap-y-4 lg:gap-y-0 mb-4 lg:mb-8">
					<div className="md:w-3/4 lg:w-full flex justify-center items-center">
						<input
							type="text"
							name="Search"
							className="w-full lg:text-lg rounded-l-lg bg-white dark:bg-gray-900 border-l-2 border-t-2 border-b-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-1"
							placeholder={"Search"}
							value={searchValue}
							onChange={(ev) =>
								updateSearchValue(ev.target.value)
							}
							onKeyPress={(ev) => {
								if (ev.key === "Enter") {
									search(true);
								}
							}}
						/>
						<button
							className="text-white rounded-r-lg bg-purple-500 dark:bg-purple-600 border-2 border-purple-500 dark:border-purple-600 px-2 lg:px-3 py-2 lg:mr-4 focus:outline-none"
							onClick={() => search(true)}
						>
							<FiSearch size={lgScreen ? 20 : 16} />
						</button>
					</div>
					<button
						className="text-lg lg:text-xl text-white rounded-lg bg-purple-500 dark:bg-purple-600 border-2 border-purple-500 dark:border-purple-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-600 dark:disabled:bg-gray-700 disabled:border-gray-600 dark:disabled:border-gray-700 px-4 py-1"
						onClick={() => {
							addToWatchlist();
						}}
						disabled={addShoes.length === 0}
					>
						Save
					</button>
				</div>
				{numResults !== 0 ? (
					searchInfos.length !== 0 ? (
						<div className="w-full h-3/5 lg:h-2/3 flex flex-col gap-y-4 overflow-auto pr-2">
							{searchInfos.map((searchInfo, index) => {
								if (index < numResults) {
									return (
										<SearchResult
											key={index}
											searchInfo={searchInfo}
											updateAddShoes={updateAddShoes}
										/>
									);
								}
							})}
						</div>
					) : (
						<p className="md:text-lg text-center dark:text-gray-300 font-semibold">
							No results found.
						</p>
					)
				) : (
					<p className="text-sm md:text-md lg:text-lg text-center dark:text-gray-300 font-medium mb-8 lg:my-4">
						Search for shoes to add to your watchlist!
					</p>
				)}
				{searchInfos.length !== 0 && (
					<button
						className="font-medium rounded-xl text-purple-600 dark:text-purple-500 border-2 border-purple-600 focus:outline-none px-4 py-2 mt-3 lg:mt-6"
						onClick={() => loadMoreResults()}
					>
						Load More
					</button>
				)}
			</div>
		</div>
	);
};

export const RenameModal: FC<Record<string, unknown>> = () => {
	const router = useRouter();

	const {
		listName,
		watchlists,
		watchlistsData,
		updateWatchlists,
		setOpenModal
	} = useContext(DashboardModalContext);

	const modalRef = useRef(null);
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
			setOpenModal("");
		}
	};

	const [editError, setEditError] = useState({});

	const updateWatchlistsAfterRename = (newListName: string) => {
		const oldListData = watchlistsData[listName];
		const newWatchlists = watchlists.reduce((lists, name) => {
			if (name !== listName) {
				lists.push(name);
			} else {
				lists.push(newListName);
			}
			return lists;
		}, []);
		delete watchlistsData[listName];
		updateWatchlists([
			false,
			newWatchlists,
			{ ...watchlistsData, [newListName]: oldListData }
		]);
	};

	const updateListName = (
		newListName: string,
		setSubmitting: (boolean) => void
	) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (listName === newListName) {
					setEditError({ message: "Please choose a different name" });
					setSubmitting(false);
				} else {
					const listsRef = db
						.collection("watchlists")
						.doc(user.uid)
						.collection("lists");
					listsRef
						.doc(newListName)
						.get()
						.then((doc) => {
							if (doc && doc.exists) {
								setEditError({
									message:
										"You already have a list with this name, please pick a new one"
								});
								setSubmitting(false);
							} else {
								listsRef
									.doc(listName)
									.get()
									.then((doc) => {
										if (doc && doc.exists) {
											const data = doc.data();
											listsRef
												.doc(newListName)
												.set(data)
												.then(() => {
													listsRef
														.doc(listName)
														.delete();
													updateWatchlistsAfterRename(
														newListName
													);
													setSubmitting(false);
													setOpenModal("");
												});
										} else {
											throw "Document doesn't exist!";
										}
									})
									.catch((error) => {
										console.error(
											"Error writing document: ",
											error
										);
									});
							}
						});
				}
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	return (
		<div
			ref={modalRef}
			className="w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 flex flex-col bg-white dark:bg-gray-900 bg-opacity-100 rounded-xl"
		>
			<div className="flex justify-end">
				<button
					className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
					onClick={() => setOpenModal("")}
				>
					<FiX size={28} />
				</button>
			</div>
			<div className="flex flex-col items-center mt-2 mb-8 lg:mb-12">
				<h1 className="text-2xl lg:text-3xl font-semibold mb-6">
					Rename Watchlist
				</h1>
				<Formik
					initialValues={{
						listName: listName
					}}
					validationSchema={ListSchema}
					onSubmit={({ listName }, { setSubmitting }) => {
						updateListName(listName, setSubmitting);
					}}
				>
					{({ errors, touched, isSubmitting }) => {
						return (
							<Form className="px-6">
								<div className="flex justify-center gap-x-4 lg:text-lg">
									<Field
										name="listName"
										placeholder="List Name"
										className="w-full font-medium rounded-lg bg-blue-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 pl-3 py-1 lg:py-2"
									/>
									<button
										type="submit"
										className="font-medium rounded-lg text-white bg-purple-600 focus:outline-none disabled:cursor-not-allowed px-4 lg:px-6 py-1 lg:py-2"
										disabled={isSubmitting}
									>
										Rename
									</button>
								</div>
								<div className="mt-6">
									<Error
										errors={
											"message" in editError
												? editError
												: errors
										}
										touched={touched}
									/>
								</div>
							</Form>
						);
					}}
				</Formik>
			</div>
		</div>
	);
};

export const DeleteModal: FC<Record<string, unknown>> = () => {
	const router = useRouter();

	const [deleteError, setDeleteError] = useState({});

	const {
		listName,
		watchlists,
		watchlistsData,
		updateWatchlists,
		activeListIndex,
		setActiveList,
		setOpenModal
	} = useContext(DashboardModalContext);

	const modalRef = useRef(null);
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
			setOpenModal("");
		}
	};

	const updateWatchlistsAfterDelete = (deleteListName: string) => {
		const newWatchlists = watchlists.reduce((lists, listName) => {
			if (listName !== deleteListName) {
				lists.push(listName);
			}
			return lists;
		}, []);
		delete watchlistsData[deleteListName];
		const newIndex = activeListIndex - 1;
		setActiveList(newIndex);
		updateWatchlists([false, newWatchlists, watchlistsData]);
	};

	const deleteWatchlist = (deleteListName, setSubmitting) => {
		console.log("code delete function");
		if (deleteListName !== listName) {
			setDeleteError({
				message: "Please ensure the input matches the watchlist's name"
			});
		} else {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					db.collection("watchlists")
						.doc(user.uid)
						.collection("lists")
						.doc(listName)
						.delete();
					updateWatchlistsAfterDelete(deleteListName);
					setSubmitting(false);
					setOpenModal("");
				} else {
					router.push({
						pathname: "/login",
						query: { from: router.pathname }
					});
				}
			});
		}
	};

	return (
		<div
			ref={modalRef}
			className="w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 flex flex-col bg-white dark:bg-gray-900 bg-opacity-100 rounded-xl"
		>
			<div className="flex justify-end">
				<button
					className="inline-block text-lg font-semibold focus:outline-none px-4 py-2"
					onClick={() => setOpenModal("")}
				>
					<FiX size={28} />
				</button>
			</div>
			<div className="flex flex-col items-center px-6 mt-2 mb-12">
				<h1 className="text-2xl lg:text-3xl font-semibold mb-2">
					Delete Watchlist
				</h1>
				<h2 className="lg:text-lg mb-6">
					Enter {`"`}
					<span className="font-medium">{`${listName}`}</span>
					{`"`} to confirm
				</h2>
				<Formik
					initialValues={{
						listName: ""
					}}
					validationSchema={ListSchema}
					onSubmit={({ listName }, { setSubmitting }) => {
						deleteWatchlist(listName, setSubmitting);
					}}
				>
					{({ errors, touched, isSubmitting }) => {
						return (
							<Form>
								<div className="flex flex-col items-center lg:text-lg gap-y-4">
									<Field
										name="listName"
										placeholder="List Name"
										className="font-medium rounded-lg bg-blue-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500 pl-3 py-1 lg:py-2"
									/>
									<button
										type="submit"
										className="font-medium text-white rounded-lg bg-red-600 focus:outline-none disabled:cursor-not-allowed px-4 lg:px-6 py-1 lg:py-2"
										disabled={isSubmitting}
									>
										Delete
									</button>
								</div>
								<Error
									errors={
										"message" in deleteError
											? deleteError
											: errors
									}
									touched={touched}
								/>
							</Form>
						);
					}}
				</Formik>
			</div>
		</div>
	);
};
