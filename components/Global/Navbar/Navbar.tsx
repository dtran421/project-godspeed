import React, { FC } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { NextRouter, withRouter } from "next/router";

import { firebase } from "../../../pages/_app";
import Dropdown from "./Dropdown";
import Navlink from "./Navlink";
import { FiSearch } from "react-icons/fi";

interface NavbarProps {
	router: NextRouter;
	page: string;
	userStatus: boolean | null;
}

const pages = ["News", "Drops", "Dashboard"];

const Navbar: FC<NavbarProps> = ({ router, page, userStatus }: NavbarProps) => {
	const [loggedIn, setLoggedIn] = useState(userStatus);

	useEffect(() => {
		let isMounted = true;
		if (userStatus === null) {
			firebase.auth().onAuthStateChanged((user) => {
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
		if (searchValue) {
			router.push(`/search?query=${searchValue}`);
		}
	};

	return (
		<div className="sticky top-0 h-16 z-30">
			<Head>
				<title>{page} | Godspeed</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="relative block md:flex md:justify-between w-full bg-white dark:bg-gray-900 transition-colors duration-150 ease-in-out border-gray-50 dark:border-gray-700 border-b px-10">
				<div className="flex py-3">
					<Link href="/">
						<div className="flex items-center cursor-pointer mr-4">
							<Image
								width={40}
								height={45}
								src="/godspeed.png"
								className="w-32"
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
				<div className="flex justify-end items-center px-2">
					<input
						type="text"
						name="Search"
						className="w-60 text-lg rounded-l-lg bg-white dark:bg-gray-900 border-l-2 border-t-2 border-b-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-1 my-3"
						placeholder={"Search"}
						value={searchValue}
						onChange={(ev) => updateSearchValue(ev.target.value)}
						onKeyPress={(ev) => {
							if (ev.key === "Enter") {
								search();
							}
						}}
					/>
					<button
						className="text-white rounded-r-lg text-lg bg-purple-500 dark:bg-purple-600 border-2 border-purple-500 dark:border-purple-600 mr-8 px-3 py-2 focus:outline-none"
						onClick={() => search()}
					>
						<FiSearch size={20} />
					</button>
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
	);
};

export default withRouter(Navbar);
