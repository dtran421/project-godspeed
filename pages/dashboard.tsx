import React from "react";
import Head from "next/head";

import Navbar from "../components/Navbar";

const Dashboard: React.FunctionComponent<null> = () => (
	<div className="container">
		<Head>
			<title>Dashboard | Godspeed</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<Navbar page={null} />
		<main className="container">

		</main>

		<footer className="footer">
			
		</footer>
	</div>
);

export default Dashboard;
