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
	const [
		[isFetchingLists, hasFetchedLists, watchlists],
		updateWatchlists
	] = useState([true, false, []]);
	useEffect(() => {
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

		let isMounted = true;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					fetchWatchlists(user.uid);
				}
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	const [searchInfos, updateSearchInfos] = useState(shoes);
	const [page, updatePage] = useState(1);
	useEffect(() => {
		updateSearchInfos(shoes);
		updatePage(1);
	}, [shoes]);

	useEffect(() => {
		const fetchSearchResults = async () => {
			await fetch(
				`http://localhost:3000/api/search?query=${query}&page=${page}`
			)
				.then((response) => response.json())
				.then((results) => {
					updateSearchInfos(results.shoes);
				});
		};

		fetchSearchResults();
	}, [page, query]);

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
				<div className="w-full">
					<div className="w-full h:48 lg:h-64 flex flex-col justify-between items-center pt-10 pb-6 lg:py-10">
						<div className="max-w-6xl mx-auto">
							<h1 className="text-3xl lg:text-5xl font-bold">
								Search
							</h1>
						</div>
						<div className="w-full flex justify-center text-xl lg:text-2xl mt-4 lg:mt-0">
							<input
								type="text"
								name="Search"
								className="w-3/5 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-2 lg:py-3 mr-4 lg:mx-8"
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
							<button className="rounded-lg text-white bg-purple-500 dark:bg-purple-600 focus:outline-none px-4 lg:px-6 py-2 lg:py-3">
								Search
							</button>
						</div>
					</div>
					<div className="max-w-6xl flex flex-col items-center lg:items-start mx-auto mb-6 lg:my-14">
						<h1 className="text-xl lg:text-3xl px-4">
							<span className="font-semibold">{`${results}${
								overflow ? "+" : ""
							}`}</span>
							{` results found for "${query}"`}
						</h1>
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-y-8 my-6">
							{searchInfos.map((searchInfo, index) => {
								return (
									<ShoeCard
										key={index}
										searchInfo={searchInfo}
									/>
								);
							})}
						</div>
						<PaginationContext.Provider value={[page, updatePage]}>
							<Pagination pages={pages} />
						</PaginationContext.Provider>
					</div>
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
