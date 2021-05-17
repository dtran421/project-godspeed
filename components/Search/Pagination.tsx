import React, { FC, useContext } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

import { PaginationContext } from "../../pages/search";

interface PaginationProps {
	pages: number;
}

const Pagination: FC<PaginationProps> = ({ pages }: PaginationProps) => {
	const [page, updatePage] = useContext(PaginationContext);

	const buttonClass =
		"text-gray-800 dark:text-gray-200 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-700 focus:outline-none";
	const arrowProps = {
		size: 20,
		className: "stroke-1"
	};

	let buttons;
	if (page < 4) {
		buttons = (
			<>
				<PageButton currPage={1} />
				<PageButton currPage={2} />
				<PageButton currPage={3} />
				<PageButton currPage={4} />
				{pages > 5 && <p className="text-lg">...</p>}
				<PageButton currPage={pages} />
			</>
		);
	} else if (page > pages - 3) {
		buttons = (
			<>
				<PageButton currPage={1} />
				{pages > 5 && <p className="text-lg">...</p>}
				<PageButton currPage={pages - 3} />
				<PageButton currPage={pages - 2} />
				<PageButton currPage={pages - 1} />
				<PageButton currPage={pages} />
			</>
		);
	} else {
		buttons = (
			<>
				<PageButton currPage={1} />

				<p className="text-lg">...</p>
				<PageButton currPage={page - 1} />
				<PageButton currPage={page} />
				<PageButton currPage={page + 1} />
				<p className="text-lg">...</p>
				<PageButton currPage={pages} />
			</>
		);
	}

	return (
		<div className="flex justify-center items-center gap-x-3 mt-10">
			<button className={buttonClass} disabled={page === 1}>
				<BsChevronLeft
					{...arrowProps}
					onClick={() => updatePage(page - 1)}
				/>
			</button>
			{buttons}
			<button className={buttonClass} disabled={page === pages}>
				<BsChevronRight
					{...arrowProps}
					onClick={() => updatePage(page + 1)}
				/>
			</button>
		</div>
	);
};

interface PageButtonProps {
	currPage: number;
}

const PageButton: FC<PageButtonProps> = ({ currPage }: PageButtonProps) => {
	const [page, updatePage] = useContext(PaginationContext);
	return (
		<button
			className={`w-12 text-lg font-semibold ${
				currPage === page ? "bg-purple-600" : "bg-gray-700"
			} rounded-xl py-1 focus:outline-none`}
			onClick={() => updatePage(currPage)}
		>
			{currPage}
		</button>
	);
};

export default Pagination;
