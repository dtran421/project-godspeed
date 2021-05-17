import React, { FC } from "react";

import { ReleaseInfo } from "../../pages/api/StructureTypes";
import HighlightReleaseCard from "./HighlightReleaseCard";

interface HighlightPanelProps {
	top3List: ReleaseInfo[];
}

const HighlightPanel: FC<HighlightPanelProps> = ({
	top3List
}: HighlightPanelProps) => {
	return (
		<div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-16">
			{top3List.map((releaseInfo, index, list) => {
				return (
					<HighlightReleaseCard
						key={index}
						releaseInfo={releaseInfo}
						showBorder={index < list.length - 1}
					/>
				);
			})}
		</div>
	);
};

export default HighlightPanel;
