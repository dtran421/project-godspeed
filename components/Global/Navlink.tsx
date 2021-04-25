import React from "react";
import Link from "next/link";

interface NavlinkProps {
	text: string;
}

const Navlink: React.FunctionComponent<NavlinkProps> = ({
	text
}: NavlinkProps) => (
	<div className="flex flex-col mx-6 justify-center">
		<Link href={`/${text.toLowerCase()}`}>
			<p className="text-xl text-center cursor-pointer">{text}</p>
		</Link>
	</div>
);

export default Navlink;
