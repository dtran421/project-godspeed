import React, {
	useState,
	useEffect,
	createContext,
	SetStateAction,
	Dispatch
} from "react";

import Navbar from "../components/Global/Navbar";
import HighlightReleaseCard from "../components/Drops/HighlightReleaseCard";
import ReleaseCard from "../components/Drops/ReleaseCard";

export const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

export const months = {
	"01": "Jan",
	"02": "Feb",
	"03": "Mar",
	"04": "Apr",
	"05": "May",
	"06": "Jun",
	"07": "Jul",
	"08": "Aug",
	"09": "Sep",
	"10": "Oct",
	"11": "Nov",
	"12": "Dec"
};

export interface ModalContext {
	loggedInContext: [Dispatch<SetStateAction<boolean>>];
	fetchingListsContext: [boolean, Dispatch<SetStateAction<boolean>>];
	fetchedContext: [boolean, Dispatch<SetStateAction<boolean>>];
	watchlistsContext: [
		{ value: string; label: string }[],
		Dispatch<SetStateAction<{ value: string; label: string }[]>>
	];
}

export const ModalContext = createContext({} as ModalContext);

const Drops: React.FunctionComponent<null> = () => {
	const [isFetching, setFetching] = useState(true);
	const [releaseDates, updateReleaseDates] = useState([]);
	const [releaseInfos, updateReleaseInfos] = useState({});

	const [top3List, updateTop3List] = useState([]);
	const [newReleases, updateNewReleases] = useState([]);

	const [loggedIn, setLoggedIn] = useState(false);
	const [isFetchingLists, setFetchingLists] = useState(true);
	const [hasFetched, setFetched] = useState(false);
	const [watchlists, updateWatchlists] = useState([]);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch(`/api/newReleases`)
				.then((response) => response.json())
				.then(({ releaseDates, top3, releaseInfos, newReleases }) => {
					updateReleaseDates(releaseDates);
					updateTop3List(top3);
					updateReleaseInfos(releaseInfos);
					updateNewReleases(newReleases);
					setFetching(false);
				});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="w-full bg-gray-100 min-h-screen">
			<Navbar page={"Drops"} userStatus={null} />
			{isFetching ? (
				<div className="flex flex-col h-screen justify-center items-center">
					<p className="text-2xl font-semibold">Loading...</p>
				</div>
			) : (
				<>
					<div className="max-w-4xl mx-auto">
						<h1 className="text-5xl font-bold mt-10 mb-6">
							Upcoming Drops
						</h1>
						<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-16">
							{top3List.map((shoeId, index, list) => {
								return (
									<ModalContext.Provider
										key={index}
										value={{
											loggedInContext: [setLoggedIn],
											fetchingListsContext: [
												isFetchingLists,
												setFetchingLists
											],
											fetchedContext: [
												hasFetched,
												setFetched
											],
											watchlistsContext: [
												watchlists,
												updateWatchlists
											]
										}}
									>
										<HighlightReleaseCard
											releaseInfo={releaseInfos[shoeId]}
											showBorder={index < list.length - 1}
										/>
									</ModalContext.Provider>
								);
							})}
						</div>
					</div>
					<div className="max-w-6xl mx-auto">
						{releaseDates.map((releaseDate, index) => {
							const dateComponents = releaseDate.split("-");
							return (
								<div
									key={index}
									className="max-w-6xl mx-auto mb-4"
								>
									<h1 className="text-4xl font-bold">{`${
										months[dateComponents[1]]
									} ${dateComponents[2].replace(
										/^0+/,
										""
									)}`}</h1>
									<div className="grid grid-cols-4 gap-x-6">
										{newReleases.map((shoeId, index) => {
											return (
												releaseInfos[shoeId]
													.releaseDate ===
													releaseDate && (
													<ModalContext.Provider
														key={index}
														value={{
															loggedInContext: [
																setLoggedIn
															],
															fetchingListsContext: [
																isFetchingLists,
																setFetchingLists
															],
															fetchedContext: [
																hasFetched,
																setFetched
															],
															watchlistsContext: [
																watchlists,
																updateWatchlists
															]
														}}
													>
														<ReleaseCard
															key={index}
															releaseInfo={
																releaseInfos[
																	shoeId
																]
															}
														/>
													</ModalContext.Provider>
												)
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}
			<footer className={"footer"}>
				<div className="w-full flex flex-row justify-between bg-gray-400 p-5 mt-10">
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold">Godspeed</h1>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Drops;
