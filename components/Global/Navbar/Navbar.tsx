import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { NextRouter, withRouter } from "next/router";

import { firebase } from "../../../pages/_app";
import Dropdown from "./Dropdown";
import Navlink from "./Navlink";

interface NavbarProps {
	router: NextRouter;
	page: string;
	userStatus: boolean | null;
}

const pages = ["News", "Drops", "Dashboard"];

const Navbar: React.FunctionComponent<NavbarProps> = ({
	router,
	page,
	userStatus
}: NavbarProps) => {
	const [loggedIn, setLoggedIn] = useState(userStatus);

	useEffect(() => {
		let isMounted = true;
		if (userStatus === null) {
			firebase.auth().onAuthStateChanged(function (user) {
				if (isMounted) {
					if (user) {
						setLoggedIn(true);
					} else {
						if (page === "Dashboard") {
							router.push("/login");
						}
					}
				}
			});
		}

		return () => {
			isMounted = false;
		};
	}, []);

	const [searchValue, updateSearchValue] = useState("");
	const search = () => {
		router.push(`/search?query=${searchValue}`);
	};

	return (
		<div className="sticky top-0 h-16 z-20">
			<Head>
				<title>{page} | Godspeed</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="relative w-full bg-white dark:bg-gray-900 transition-colors duration-150 ease-in-out border-gray-50 dark:border-gray-700 border-b">
				<div className="grid grid-cols-2 px-10 py-3">
					<div className="flex">
						<Link href="/">
							<div className="flex items-center cursor-pointer mr-4">
								<Image
									width={40}
									height={45}
									src="/godspeed.png"
								/>
								<h1 className="font-bold text-3xl ml-2">
									Godspeed
								</h1>
							</div>
						</Link>
						<div className="flex">
							{pages.map((text, index) => {
								return <Navlink key={index} text={text} />;
							})}
						</div>
					</div>
					<div className="w-full flex justify-end items-center px-2">
						<input
							type="text"
							name="Search"
							className="w-64 text-lg rounded-full bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-1 mx-8"
							placeholder={"Search"}
							value={searchValue}
							onChange={(ev) =>
								updateSearchValue(ev.target.value)
							}
							onKeyPress={(ev) => {
								if (ev.key === "Enter") {
									search();
								}
							}}
						/>
						{loggedIn ? (
							<Dropdown />
						) : (
							<Link href="/login">
								<p className="text-xl font-medium cursor-pointer">
									Login
								</p>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Navbar);
