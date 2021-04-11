import React from "react";

export interface WatchlistListProps {
	lists: string[];
	active: number;
	setList: React.Dispatch<React.SetStateAction<number>>;
}

const WatchlistList: React.FunctionComponent<WatchlistListProps> = ({
	lists,
	active,
	setList
}: WatchlistListProps) => (
	<div className="w-1/5 flex flex-col bg-white shadow-lg rounded-lg mr-10 py-8">
		<h1 className="text-2xl text-center font-semibold pb-8">Watchlists</h1>
		{lists.map((listName, index) => {
			return (
				<div
					key={index}
					className={`border-l-4 ${
						active === index
							? "border-purple-600 bg-purple-100"
							: "border-transparent"
					} cursor-pointer`}
					onClick={() => {
						setList(index);
					}}
				>
					<p className="text-lg px-6 py-2">{listName}</p>
				</div>
			);
		})}
		<div className="my-2 text-center">
			<button className="rounded-full bg-purple-50 border-2 border-purple-600 text-purple-600 font-medium text-lg mx-6 px-6 py-1 hover:bg-purple-600 hover:text-white">
				New list
			</button>
		</div>
	</div>
);

export default WatchlistList;
