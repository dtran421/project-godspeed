import React from "react";
import { useState, useEffect } from "react";
import { NextRouter, withRouter } from "next/router";

import { firebase, db } from "../pages/_app";
import WatchlistList from "../components/Dashboard/WatchlistList";
import WatchlistDisplay from "../components/Dashboard/WatchlistDisplay";
import Navbar from "../components/Global/Navbar";

interface DashboardProps {
	router: NextRouter;
}

const Dashboard: React.FunctionComponent<DashboardProps> = ({
	router
}: DashboardProps) => {
	const [
		[isFetching, watchlists, watchlistsData],
		updateWatchlists
	] = useState([true, [], {}]);
	const [activeListIndex, setActiveList] = useState(-1);

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
					fetchedWatchlistsData[listDoc.id] = listDoc.data().shoes;
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

	const updateWatchlistsAfterCreation = (newList: string) => {
		updateWatchlists([
			false,
			[...watchlists, newList],
			{ ...watchlistsData, [newList]: [] }
		]);
		setActiveList(watchlists.length);
	};

	useEffect(() => {
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
							<>
								<WatchlistList
									lists={watchlists}
									active={activeListIndex}
									setList={setActiveList}
									updateWatchlistsAfterCreation={
										updateWatchlistsAfterCreation
									}
								/>
								<div className="flex items-start mx-auto max-w-7xl">
									<WatchlistDisplay
										shoeChildren={
											activeListIndex >= 0
												? watchlistsData[
														watchlists[
															activeListIndex
														]
												  ]
												: null
										}
									/>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<footer className="footer"></footer>
		</div>
	);
};

export default withRouter(Dashboard);
