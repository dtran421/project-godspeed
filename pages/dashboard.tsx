import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { firebase, db } from "../pages/_app";
import WatchlistList from "../components/Dashboard/WatchlistList";
import WatchlistDisplay from "../components/Dashboard/WatchlistDisplay";
import Navbar from "../components/Global/Navbar";

const Dashboard: React.FunctionComponent<null> = () => {
	const router = useRouter();
	const [isFetching, setFetching] = useState(true);
	const [activeListIndex, setActiveList] = useState(-1);
	const [watchlists, updateWatchlists] = useState([]);
	const [watchlistsData, updateWatchlistsData] = useState({});

	const fetchWatchLists = (userUID) => {
		db.collection("watchlists")
			.doc(userUID)
			.get()
			.then((doc) => {
				if (doc.exists) {
					console.log("Document data:", doc.data());
					updateWatchlistsData(doc.data());
					updateWatchlists(Object.keys(doc.data()));
					setActiveList(0);
					setFetching(false);
				} else {
					console.log("No such document!");
					setFetching(false);
				}
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	};

	const updateWatchlistsAfterCreation = (lists: string[]) => {
		updateWatchlists(lists);
		const tempWatchlistsData = watchlistsData;
		tempWatchlistsData[lists[lists.length - 1]] = { shoes: [] };
		updateWatchlistsData(tempWatchlistsData);
		setActiveList(lists.length - 1);
	};

	useEffect(() => {
		let isMounted = true;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					fetchWatchLists(user.uid);
				}
			} else {
				router.push("/login");
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="w-full">
			<div className="flex flex-col w-full min-h-screen bg-gray-100">
				<Navbar page={"Dashboard"} userStatus={true} />
				<div className="flex-1 flex justify-center items-center">
					<div className="w-full justify-center py-24">
						{isFetching ? (
							<div>
								<p className="text-center text-2xl font-semibold">
									Loading...
								</p>
							</div>
						) : (
							<div className="flex items-start mx-auto max-w-7xl">
								<WatchlistList
									lists={watchlists}
									active={activeListIndex}
									setList={setActiveList}
									updateWatchlistsAfterCreation={
										updateWatchlistsAfterCreation
									}
								/>
								<WatchlistDisplay
									activeList={
										activeListIndex >= 0
											? watchlistsData[
													watchlists[activeListIndex]
											  ].shoes
											: null
									}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
			<footer className="footer"></footer>
		</div>
	);
};

export default Dashboard;
