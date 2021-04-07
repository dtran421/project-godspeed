import React from "react";
import Head from "next/head";

const Index: React.FunctionComponent<null> = () => (
	<div className="container">
		<Head>
			<title>Home | Godspeed</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<main className={"container"}>

		</main>

		<footer className={"footer"}>
			<a
				href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
				target="_blank"
				rel="noopener noreferrer"
			>
          Powered by{" "}
				<img src="/vercel.svg" alt="Vercel Logo" className={"logo"} />
			</a>
		</footer>
	</div>
);

export default Index;
