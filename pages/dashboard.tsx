import React from "react";
import Head from "next/head";

import Navbar from "../components/Global/Navbar";
import DashboardDisplay from "../components/Dashboard/DashboardDisplay";

const Dashboard: React.FunctionComponent<null> = () => (
	<div className="w-full">
		<Head>
			<title>Dashboard | Godspeed</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<main className="flex flex-col w-full min-h-screen bg-gray-100">
			<Navbar page={null} />
			<div className="flex-1 flex justify-center items-center">
				<DashboardDisplay test={0} />
			</div>
		</main>

		<footer className="footer"></footer>
	</div>
);

export default Dashboard;
