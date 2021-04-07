import React from "react";
import Head from "next/head";

export interface NavbarProps {
   page: string;
}

const Navbar: React.FunctionComponent<NavbarProps> = () => (
	<div className="container">
		<main className="container">
			<div className="logo">
				<h1 className="font-bold text-8xl">Godspeed</h1>
			</div>
		</main>
	</div>
);

export default Navbar;
