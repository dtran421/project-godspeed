import React, { FC, useState, useEffect, createContext } from "react";
import { GetServerSideProps } from "next";
import { NextRouter, withRouter } from "next/router";

import MainLayout from "../components/Global/Layouts/MainLayout";
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
			<div className="w-full h-64 flex flex-col justify-between items-center py-10">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-5xl font-bold">Search</h1>
				</div>
				<input
					type="text"
					name="Search"
					className="w-1/2 text-2xl rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-3 mx-8"
					placeholder={"Search"}
					value={searchValue}
					onChange={(ev) => updateSearchValue(ev.target.value)}
					onKeyPress={(ev) => {
						if (ev.key === "Enter") {
							search();
						}
					}}
				/>
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
						return <ShoeCard key={index} searchInfo={searchInfo} />;
					})}
				</div>
				<PaginationContext.Provider value={[page, updatePage]}>
					<Pagination pages={pages} />
				</PaginationContext.Provider>
			</div>
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
