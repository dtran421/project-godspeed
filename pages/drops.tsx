import React, {
	useState,
	useEffect,
	createContext,
	SetStateAction,
	Dispatch
} from "react";
import { useRouter } from "next/router";
import { FiArrowUp } from "react-icons/fi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import { MAX_SHOES_PER_LINE } from "./api/newReleases";
import Navbar from "../components/Global/Navbar";
import HighlightReleaseCard from "../components/Drops/HighlightReleaseCard";
import ReleaseCard from "../components/Drops/ReleaseCard";

export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
	watchlistsContext: [
		boolean,
		boolean,
		{ value: string; label: string }[],
		Dispatch<
			SetStateAction<
				[boolean, boolean, { value: string; label: string }[]]
			>
		>
	];
}

export const ModalContext = createContext({} as ModalContext);

const prepMonth = (router) => {
	const monthQuery = router.query.month as string;
	let checkMonth = new Date().getMonth() + 1;
	if (
		monthQuery !== undefined &&
		!isNaN(checkMonth) &&
		checkMonth >= 1 &&
		checkMonth <= 12
	) {
		checkMonth = parseInt(monthQuery);
	}
	return checkMonth.toString().padStart(2, "0");
};

const Drops: React.FunctionComponent<null> = () => {
	const router = useRouter();

	const [[month, index, releaseMonths], updateMonth] = useState([
		prepMonth(router),
		0,
		[]
	]);
	const [top3List, updateTop3List] = useState([]);
	const [[isFetchingNewReleases, newReleases], updateNewReleases] = useState([
		true,
		[]
	]);

	const [
		[isFetchingLists, hasFetchedLists, watchlists],
		updateWatchlists
	] = useState([true, false, []]);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetch(`/api/newReleases?month=${month}`)
				.then((response) => response.json())
				.then(
					({
						top3,
						newReleases,
						month: { current, index },
						releaseMonths
					}) => {
						updateTop3List(top3);
						updateNewReleases([false, newReleases]);
						updateMonth([current, index, releaseMonths]);
						router.push(`?month=${current}`, "/drops", {
							shallow: true
						});
					}
				);
		}

		return () => {
			isMounted = false;
		};
	}, [month]);

	const paginate = (direction: number) => {
		const newMonth = releaseMonths[index + direction];
		updateMonth([newMonth, index + direction, releaseMonths]);
		router.push(`?month=${newMonth}`, "/drops", { shallow: true });
	};

	const buttonClass =
		"flex items-center text-gray-800 mx-4 disabled:cursor-not-allowed disabled:text-gray-400 focus:outline-none";
	const arrowProps = {
		size: 28,
		className: "stroke-1"
	};

	return (
		<div className="w-full bg-gray-100 min-h-screen">
			<Navbar page={"Drops"} userStatus={null} />
			{isFetchingNewReleases ? (
				<div className="flex flex-col h-screen justify-center items-center">
					<p className="text-2xl font-semibold">Loading...</p>
				</div>
			) : (
				<>
					<div className="max-w-5xl mx-auto">
						<h1 className="text-5xl font-bold mt-10 mb-6">
							Upcoming Drops
						</h1>
						<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-16">
							{top3List.map((releaseInfo, index, list) => {
								return (
									<ModalContext.Provider
										key={index}
										value={{
											watchlistsContext: [
												isFetchingLists,
												hasFetchedLists,
												watchlists,
												updateWatchlists
											]
										}}
									>
										<HighlightReleaseCard
											releaseInfo={releaseInfo}
											showBorder={index < list.length - 1}
										/>
									</ModalContext.Provider>
								);
							})}
						</div>
					</div>
					<div className="flex justify-center w-full bg-purple-200 p-2 mb-8">
						<div className="flex justify-between max-w-md">
							<button
								className={buttonClass}
								disabled={index === 0}
							>
								<BsChevronLeft
									{...arrowProps}
									onClick={() => paginate(-1)}
								/>
							</button>
							<p className="w-16 text-2xl text-center font-medium uppercase">
								{months[month.toString().padStart(2, "0")]}
							</p>
							<button
								className={buttonClass}
								disabled={index === releaseMonths.length - 1}
							>
								<BsChevronRight
									{...arrowProps}
									onClick={() => paginate(1)}
								/>
							</button>
						</div>
					</div>
					<div className="max-w-6xl mx-auto">
						{Object.keys(newReleases).map((releaseDate, index) => {
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
									<div
										className={`grid grid-cols-${MAX_SHOES_PER_LINE} gap-x-6`}
									>
										{newReleases[releaseDate].map(
											(releaseInfo, index) => {
												return (
													<ModalContext.Provider
														key={index}
														value={{
															watchlistsContext: [
																isFetchingLists,
																hasFetchedLists,
																watchlists,
																updateWatchlists
															]
														}}
													>
														<ReleaseCard
															key={index}
															releaseInfo={
																releaseInfo
															}
														/>
													</ModalContext.Provider>
												);
											}
										)}
									</div>
								</div>
							);
						})}
					</div>
					<div className="fixed right-8 bottom-8">
						<button className="rounded-full border-4 border-gray-400 focus:outline-none">
							<FiArrowUp
								size={42}
								className="stroke-2 text-purple-400"
							/>
						</button>
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
