import React, { FC, useState, useEffect, createContext } from "react";
import { GetServerSideProps } from "next";
import { NextRouter, withRouter } from "next/router";

import { firebase, db } from "../pages/_app";
import MainLayout from "../components/Global/Layouts/MainLayout";
import { ModalContext } from "../components/Global/Modal";
import ShoeCard from "../components/Search/ShoeCard";
import { SearchInfo } from "./api/StructureTypes";
import Pagination from "../components/Search/Pagination";

export const PaginationContext = createContext([]);

interface SearchPageProps {
	router: NextRouter;
	query: string;
	shoes: SearchInfo[];
	results: number;
	pages: number;
	overflow: boolean;
}

const SearchPage: FC<SearchPageProps> = ({
	router,
	query,
	shoes,
	results,
	pages,
	overflow
}: SearchPageProps) => {
	const [isMounted, setMounted] = useState(true);

	const [
		[isFetchingLists, hasFetchedLists, watchlists],
		updateWatchlists
	] = useState([true, false, []]);
	const fetchWatchlists = (userUID: string) => {
		db.collection("watchlists")
			.doc(userUID)
			.collection("lists")
			.get()
			.then((listDocs) => {
				const fetchedWatchlists = [];
				listDocs.forEach((listDoc) => {
					fetchedWatchlists.push({
						value: listDoc.id,
						label: listDoc.id
					});
				});
				updateWatchlists([false, true, fetchedWatchlists]);
			})
			.catch((error) => {
				console.log("Error getting document:", error);
			});
	};
	useEffect(() => {
		setMounted(true);
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
			setMounted(false);
		};
	}, []);

	const [searchInfos, updateSearchInfos] = useState(shoes);
	const [page, updatePage] = useState(1);
	useEffect(() => {
		updateSearchInfos(shoes);
		updatePage(1);
	}, [shoes]);

	const fetchSearchResults = async () => {
		await fetch(
			`http://localhost:3000/api/search?query=${query}&page=${page}`
		)
			.then((response) => response.json())
			.then((results) => {
				updateSearchInfos(results.shoes);
			});
	};

	useEffect(() => {
		fetchSearchResults();
	}, [page]);

	const [searchValue, updateSearchValue] = useState("");
	const search = () => {
		router.push(`/search?query=${searchValue}`);
	};

	return (
		<MainLayout page={"Search"} userStatus={null}>
			<ModalContext.Provider
				value={{
					watchlistsContext: [
						isFetchingLists,
						hasFetchedLists,
						watchlists,
						updateWatchlists
					]
				}}
			>
				<div className="w-full h-64 flex flex-col justify-between items-center py-10">
					<div className="max-w-6xl mx-auto">
						<h1 className="text-5xl font-bold">Search</h1>
					</div>
					<div className="w-full flex justify-center text-2xl">
						<input
							type="text"
							name="Search"
							className="w-1/2 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-3 mx-8"
							placeholder={"Search"}
							value={searchValue}
							onChange={(ev) =>
								updateSearchValue(ev.target.value)
							}
							onKeyPress={(ev) => {
								if (ev.key === "Enter") {
									search();
								}
							}}
						/>
						<button className="rounded-lg text-white bg-purple-500 dark:bg-purple-600 focus:outline-none px-6 py-3">
							Search
						</button>
					</div>
				</div>
				<div className="max-w-6xl mx-auto my-14">
					<h1 className="text-3xl px-4">
						<span className="font-semibold">{`${results}${
							overflow ? "+" : ""
						}`}</span>
						{` results found for "${query}"`}
					</h1>
					<div className="grid grid-cols-4 gap-y-8 my-6">
						{searchInfos.map((searchInfo, index) => {
							return (
								<ShoeCard key={index} searchInfo={searchInfo} />
							);
						})}
					</div>
					<PaginationContext.Provider value={[page, updatePage]}>
						<Pagination pages={pages} />
					</PaginationContext.Provider>
				</div>
			</ModalContext.Provider>
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	query: { query }
}) => {
	const response = await fetch(
		`http://localhost:3000/api/search?query=${query}`
	);
	const results = await response.json();

	return {
		props: { query, ...results }
	};
};

export default withRouter(SearchPage);
