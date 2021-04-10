import React from "react";
import Link from "next/link";
import Image from "next/image";

import Navlink from "./Navlink";

export interface NavbarProps {
	page: string;
}

const pages = ["News", "Drops", "Dashboard"];

const Navbar: React.FunctionComponent<NavbarProps> = () => (
	<div className="w-full bg-white border-gray-200 border-b-2">
		<div className="grid grid-cols-3 px-10 py-2">
			<Link href="/">
				<div className="flex items-center cursor-pointer">
					<div className="px-2">
						<Image width={40} height={45} src="/godspeed.png" />
					</div>
					<h1 className="font-bold text-3xl">Godspeed</h1>
				</div>
			</Link>

			<div className="grid grid-cols-3 justify-center">
				{pages.map((text, index) => {
					return <Navlink key={index} text={text} />;
				})}
			</div>
		</div>
	</div>
);

export default Navbar;
