import React, { FC } from "react";
import Link from "next/link";

interface NavlinkProps {
	text: string;
}

const Navlink: FC<NavlinkProps> =   ({ text }: NavlinkProps) => (
	<div className="flex flex-col mx-6 justify-center">
		<Link href={`/${text.toLowerCase()}`}>
			<p className="text-lg lg:text-xl text-center cursor-pointer">
				{text}
			</p>
		</Link>
	</div>
);

export default Navlink;
