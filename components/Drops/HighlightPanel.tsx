import React, { FC } from "react";
import _ from "lodash";

import { ReleaseInfo } from "../../pages/api/StructureTypes";
import HighlightReleaseCard from "./HighlightReleaseCard";

interface HighlightPanelProps {
	top3List: ReleaseInfo[];
}

const HighlightPanel: FC<HighlightPanelProps> = ({
	top3List
}: HighlightPanelProps) => {
	return (
		<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
			{!top3List.length
				? _.times(3, (index) => {
						return (
							<HighlightReleaseCard
								key={index}
								releaseInfo={{
									urlKey: "",
									uuid: "",
									name: "",
									ticker: "",
									imageUrl: "",
									releaseDate: "",
									prices: null
								}}
								showBorder={index < 2}
							/>
						);
				  })
				: top3List.map((releaseInfo, index) => {
						return (
							<HighlightReleaseCard
								key={index}
								releaseInfo={releaseInfo}
								showBorder={index < 2}
							/>
						);
				  })}
		</div>
	);
};

export default HighlightPanel;
