import React, { FC, useContext } from "react";
import _ from "lodash";
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
	if (pages <= 5) {
		buttons = (
			<>
				{_.times(pages, (index) => (
					<PageButton key={index} currPage={index + 1} />
				))}
			</>
		);
	} else if (page < 4) {
		buttons = (
			<>
				{_.times(4, (index) => (
					<PageButton key={index} currPage={index + 1} />
				))}
				{pages > 5 && <p className="text-lg">...</p>}
				<PageButton currPage={pages} />
			</>
		);
	} else if (page > pages - 3) {
		buttons = (
			<>
				<PageButton currPage={1} />
				{pages > 5 && <p className="text-lg">...</p>}
				{_.times(4, (index) => (
					<PageButton
						key={pages - (4 - index - 1)}
						currPage={pages - (4 - index - 1)}
					/>
				))}
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
		<div className="w-full">
			<div className="flex justify-center items-center gap-x-3 px-8 lg:px-0 mt-10">
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
			} rounded-xl px-1 lg:px-0 py-1 focus:outline-none`}
			onClick={() => updatePage(currPage)}
		>
			{currPage}
		</button>
	);
};

export default Pagination;
