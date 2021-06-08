import React, {
	FC,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	createContext
} from "react";
import { NextRouter, withRouter } from "next/router";
import Popup from "reactjs-popup";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

import { firebase, db } from "../pages/_app";
import {
	CardInfo,
	ShoeInfos,
	ChildInfo,
	ChildInfos,
	ShoeChild,
	WatchlistData
} from "../pages/api/StructureTypes";
import UserLayout from "../components/Global/Layouts/UserLayout";
import WatchlistList from "../components/Dashboard/WatchlistList";
import WatchlistDisplay from "../components/Dashboard/WatchlistDisplay";
import {
	AddModal,
	RenameModal,
	DeleteModal
} from "../components/Dashboard/Modals";
import { prepareDashboardTable } from "../components/Dashboard/Table/PrepareTableData";

interface DashboardModalContext {
	listName: string;
	watchlists: string[];
	watchlistsData: Record<string, WatchlistData>;
	updateWatchlists: Dispatch<
		SetStateAction<[boolean, string[], Record<string, WatchlistData>]>
	>;
	activeListIndex: number;
	setActiveList: Dispatch<SetStateAction<number>>;
	setOpenModal: Dispatch<SetStateAction<string>>;
}

export const DashboardModalContext = createContext<DashboardModalContext>(
	{} as DashboardModalContext
);

interface DashboardContext {
	isFetching: boolean;
	isFetchingShoes: boolean;
	isFetchingChildren: boolean;
	shoeInfos: ShoeInfos;
	deleteShoe: (shoeId: string, child: boolean, parent: string) => void;
}

export const DashboardContext = createContext({} as DashboardContext);

const fetchShoeInfos = async (
	shoeInfos: ShoeInfos,
	list: string[]
): Promise<ShoeInfos> => {
	const newShoeInfos = shoeInfos;
	const fetchRequests = list.map(async (urlKey) => {
		if (!(urlKey in newShoeInfos)) {
			newShoeInfos[urlKey] = {} as CardInfo;
			const promise = await fetch(`/api/fetchShoe/${urlKey}`)
				.then((response) => response.json())
				.then((shoeData: CardInfo) => {
					newShoeInfos[urlKey] = shoeData;
				});
			return promise;
		}
	});
	await Promise.all(fetchRequests);
	return newShoeInfos;
};

const fetchChildrenInfos = async (
	childrenInfos: ChildInfos,
	children: Record<string, ShoeChild[]>
): Promise<ChildInfos> => {
	const newChildrenInfos = childrenInfos;
	const parentFetchRequests = Object.keys(children).map(async (parentKey) => {
		const childFetchRequests = children[parentKey].map(async ({ uuid }) => {
			if (!(uuid in newChildrenInfos)) {
				newChildrenInfos[uuid] = {} as ChildInfo;
				const promise = await fetch(`/api/fetchShoe/${uuid}`)
					.then((response) => response.json())
					.then((childData: ChildInfo) => {
						newChildrenInfos[uuid] = childData;
					});
				return promise;
			}
		});
		await Promise.all(childFetchRequests);
	});
	await Promise.all(parentFetchRequests);
	return newChildrenInfos;
};

interface DashboardProps {
	router: NextRouter;
}

const Dashboard: FC<DashboardProps> = ({ router }: DashboardProps) => {
	const [
		[isFetching, watchlists, watchlistsData],
		updateWatchlists
	] = useState<[boolean, string[], Record<string, WatchlistData>]>([
		true,
		[],
		{}
	]);
	const [activeListIndex, setActiveList] = useState(-1);

	useEffect(() => {
		const fetchWatchlists = (userUID) => {
			db.collection("watchlists")
				.doc(userUID)
				.collection("lists")
				.get()
				.then((listDocs) => {
					const fetchedWatchlists = [],
						fetchedWatchlistsData = {};
					listDocs.forEach((listDoc) => {
						fetchedWatchlists.push(listDoc.id);
						fetchedWatchlistsData[listDoc.id] = {
							shoes: listDoc.data().shoes,
							created: listDoc.data().created.toDate()
						};
					});
					updateWatchlists([
						false,
						fetchedWatchlists,
						fetchedWatchlistsData
					]);
					if (fetchedWatchlists.length > 0) {
						setActiveList(0);
					}
				})
				.catch((error) => {
					console.log("Error getting document:", error);
				});
		};

		let isMounted = true;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					fetchWatchlists(user.uid);
				}
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});

		return () => {
			isMounted = false;
		};
	}, [router]);

	const [[listShoes, shoeChildren, creationDate], updateListInfo] = useState<
		[string[], Record<string, ShoeChild[]>, string]
	>([[], {}, ""]);
	useEffect(() => {
		const listData = watchlistsData[watchlists[activeListIndex]];
		if (listData) {
			const created = new Date(listData.created);
			const creationDate = `${
				created.getMonth() + 1
			}/${created.getDate()}/${created.getFullYear()}`;
			updateListInfo([
				Object.keys(listData.shoes),
				listData.shoes,
				creationDate
			]);
		}
	}, [activeListIndex, watchlists, watchlistsData]);

	const [[graphShoe, shoeName, shoeData], updateGraphShoe] = useState([
		"",
		"",
		[] as number[]
	]);

	const [[isFetchingShoes, shoeInfos], updateShoeInfos] = useState([
		true,
		{}
	]);
	const [
		[isFetchingChildren, childrenInfos],
		updateChildrenInfos
	] = useState([true, {}]);
	const [tableData, updateTableData] = useState([]);

	useEffect(() => {
		const processShoeInfos = async () => {
			const newShoeInfos = await fetchShoeInfos(shoeInfos, listShoes);
			const newChildrenInfos = await fetchChildrenInfos(
				childrenInfos,
				shoeChildren
			);
			updateShoeInfos([false, newShoeInfos]);
			updateChildrenInfos([false, newChildrenInfos]);
			updateTableData(
				prepareDashboardTable(
					newShoeInfos,
					newChildrenInfos,
					listShoes,
					shoeChildren
				)
			);
			if (listShoes.length) {
				updateGraphShoe([
					listShoes[0],
					newShoeInfos[listShoes[0]].name,
					[]
				]);
			}
		};

		if (shoeChildren) {
			processShoeInfos();
		}
	}, [childrenInfos, listShoes, shoeChildren, shoeInfos, watchlistsData]);

	const deleteShoe = (shoeId: string, child: boolean, parent?: string) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const newWatchlistsData = { ...watchlistsData };
				const newShoes =
					newWatchlistsData[watchlists[activeListIndex]].shoes;
				if (child) {
					newShoes[parent] = newShoes[parent].reduce(
						(newChildren, shoeChild) => {
							if (shoeChild.uuid !== shoeId) {
								newChildren.push(shoeChild);
							}
							return newChildren;
						},
						[]
					);
				} else {
					delete newShoes[shoeId];
				}
				db.collection("watchlists")
					.doc(user.uid)
					.collection("lists")
					.doc(watchlists[activeListIndex])
					.update({ shoes: newShoes })
					.then(() => {
						console.log("shoe deleted!");
						updateListInfo([
							Object.keys(newShoes),
							newShoes,
							creationDate
						]);
						updateWatchlists([
							isFetching,
							watchlists,
							newWatchlistsData
						]);
					})
					.catch((error) => {
						console.error("Error writing document: ", error);
					});
			} else {
				router.push({
					pathname: "/login",
					query: { from: router.pathname }
				});
			}
		});
	};

	const updateWatchlistsAfterCreation = (
		newList: string,
		creationDate: Date
	) => {
		updateWatchlists([
			false,
			[...watchlists, newList],
			{
				...watchlistsData,
				[newList]: { shoes: {}, created: creationDate } as WatchlistData
			}
		]);
		setActiveList(watchlists.length);
	};

	const [openModal, setOpenModal] = useState("");
	let modal;
	switch (openModal) {
		case "add":
			modal = <AddModal />;
			break;
		case "rename":
			modal = <RenameModal />;
			break;
		case "delete":
			modal = <DeleteModal />;
			break;
		default:
			modal = "";
			break;
	}

	return (
		<UserLayout page={"Dashboard"} userStatus={true}>
			<div className="h-full flex flex-1 justify-center items-center">
				<div className="w-full h-full py-16">
					<WatchlistList
						isFetching={isFetching}
						lists={watchlists}
						active={activeListIndex}
						setList={setActiveList}
						updateWatchlistsAfterCreation={
							updateWatchlistsAfterCreation
						}
					/>
					<div className="w-full flex justify-center lg:justify-end">
						<div className="w-full lg:w-3/4 xl:w-5/6 mt-4 lg:mt-0 px-6 lg:px-0">
							<div className="lg:max-w-2xl xl:max-w-5xl mx-auto">
								<div className="flex flex-col lg:flex-row items-center lg:justify-between lg:items-end mb-6 lg:mb-10">
									<h1 className="text-3xl lg:text-5xl text-center lg:text-left font-semibold">
										Watchlist Performance
									</h1>
									{activeListIndex !== -1 && (
										<div className="flex items-end gap-x-4 mt-3 lg:mt-0">
											<button
												className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors duration-100 ease-in-out focus:outline-none rounded-full shadow-lg p-2"
												onClick={() =>
													setOpenModal("add")
												}
											>
												<FiPlus size={22} />
											</button>
											<button
												className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-100 ease-in-out focus:outline-none rounded-full shadow-lg p-2"
												onClick={() =>
													setOpenModal("rename")
												}
											>
												<FiEdit size={22} />
											</button>
											<button
												className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-100 ease-in-out focus:outline-none rounded-full shadow-lg p-2"
												onClick={() =>
													setOpenModal("delete")
												}
											>
												<FiTrash2 size={22} />
											</button>
										</div>
									)}
								</div>
								<Popup
									open={openModal !== ""}
									closeOnDocumentClick
									onClose={() => setOpenModal("")}
								>
									<div className="w-screen h-screen bg-gray-700 bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70">
										<div className="w-full h-full flex justify-center items-center py-14">
											<DashboardModalContext.Provider
												value={{
													listName:
														watchlists[
															activeListIndex
														],
													watchlists,
													watchlistsData,
													updateWatchlists,
													activeListIndex,
													setActiveList,
													setOpenModal
												}}
											>
												{modal}
											</DashboardModalContext.Provider>
										</div>
									</div>
								</Popup>
								<DashboardContext.Provider
									value={{
										isFetching,
										isFetchingShoes,
										isFetchingChildren,
										shoeInfos,
										deleteShoe
									}}
								>
									<WatchlistDisplay
										activeList={watchlists[activeListIndex]}
										listShoes={listShoes}
										creationDate={creationDate}
										graphShoe={graphShoe}
										shoeName={shoeName}
										shoeData={shoeData}
										updateGraphShoe={updateGraphShoe}
										tableData={tableData}
									/>
								</DashboardContext.Provider>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
};

export default withRouter(Dashboard);
