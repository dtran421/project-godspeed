import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { NextRouter, withRouter } from "next/router";
import { useTheme } from "next-themes";
import {
	FiArrowLeftCircle,
	FiLogOut,
	FiMoon,
	FiSettings,
	FiSun
} from "react-icons/fi";
import { useMediaQuery } from "react-responsive";

import { firebase } from "../../../pages/_app";
import Dropdown from "./Dropdown";
import Navlink from "./Navlink";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import { lgScreenQuery } from "../Configs/Breakpoints";

interface NavbarProps {
	router: NextRouter;
	page: string;
	userStatus: boolean | null;
}

const pages = ["News", "Drops", "Dashboard"];

const Navbar: FC<NavbarProps> = ({ router, page, userStatus }: NavbarProps) => {
	const lgScreen = useMediaQuery(lgScreenQuery);

	const { theme, setTheme } = useTheme();

	const [loggedIn, setLoggedIn] = useState(userStatus);

	useEffect(() => {
		let isMounted = true;
		if (userStatus === null) {
			firebase.auth().onAuthStateChanged((user) => {
				if (isMounted) {
					if (user) {
						setLoggedIn(true);
					} else {
						if (page === "Dashboard" || page === "Settings") {
							toggleAccountMenu(false);
							router.push("/login");
						}
					}
				}
			});
		}

		return () => {
			isMounted = false;
		};
	}, [page, router, userStatus]);

	const [isMenuVisible, showMenu] = useState(false);

	const [isAccountMenuVisible, toggleAccountMenu] = useState(false);

	const [searchValue, updateSearchValue] = useState("");
	const search = () => {
		if (searchValue) {
			router.push(`/search?query=${searchValue}`);
		}
	};

	const logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log("User signed out");
				router.push("/login", "/login");
			})
			.catch((error) => {
				console.log("Something went wrong: ", error);
			});
	};

	const dropdownLinkClass =
		"w-full flex items-center text-left font-medium px-2 rounded-lg focus:outline-none";
	return (
		<div className="sticky top-0 h-16 z-30">
			<Head>
				<title>{page} | Godspeed</title>
				<link rel="icon" type="image/png" href="/godspeed.png" />
			</Head>
			<div className="w-full relative lg:flex lg:justify-between bg-white dark:bg-gray-900 transition-colors duration-150 ease-in-out border-gray-50 dark:border-gray-700 border-b px-4 lg:px-6 xl:px-10">
				<div className="w-full flex justify-between lg:justify-start py-3">
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
					<div className="hidden lg:flex">
						{pages.map((text, index) => {
							return <Navlink key={index} text={text} />;
						})}
					</div>
					<button
						className="lg:hidden flex items-center focus:outline-none"
						onClick={() => {
							showMenu(!isMenuVisible);
							toggleAccountMenu(!isAccountMenuVisible);
						}}
					>
						{isMenuVisible ? (
							<FiX size={24} />
						) : (
							<FiMenu size={24} />
						)}
					</button>
				</div>
				{isMenuVisible && (
					<div className="lg:hidden flex flex-col items-center gap-y-4 pb-4">
						{isAccountMenuVisible ? (
							<div className="md:text-lg w-full flex flex-col items-start gap-y-4 mt-2">
								<button
									className={dropdownLinkClass}
									onClick={() =>
										toggleAccountMenu(!isAccountMenuVisible)
									}
								>
									<span className="pl-1 mr-2">
										<FiArrowLeftCircle size={22} />
									</span>{" "}
									Back to Menu
								</button>
								<button
									className={dropdownLinkClass}
									onClick={() =>
										setTheme(
											theme === "dark" ? "light" : "dark"
										)
									}
								>
									<span className="p-1 mr-2 rounded-full bg-gray-800 dark:bg-gray-50 text-white dark:text-black">
										{theme === "dark" ? (
											<FiSun size={18} />
										) : (
											<FiMoon size={18} />
										)}
									</span>{" "}
									Toggle Theme
								</button>
								<Link href="/settings">
									<button className={dropdownLinkClass}>
										<span className="p-1 mr-2">
											<FiSettings size={18} />
										</span>{" "}
										Settings
									</button>
								</Link>
								<button
									className={dropdownLinkClass}
									onClick={() => logout()}
								>
									<span className="p-1 mr-2">
										<FiLogOut size={18} />
									</span>{" "}
									Logout
								</button>
							</div>
						) : (
							<>
								{pages.map((text, index) => {
									return <Navlink key={index} text={text} />;
								})}
								<div className="flex justify-center items-center">
									<input
										type="text"
										name="Search"
										className="w-52 lg:text-lg rounded-l-lg bg-white dark:bg-gray-900 border-l-2 border-t-2 border-b-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-1"
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
									<button
										className="text-white rounded-r-lg text-lg bg-purple-500 dark:bg-purple-600 focus:outline-none px-2 lg:px-3 py-2"
										onClick={() => search()}
									>
										<FiSearch size={20} />
									</button>
								</div>
								{loggedIn ? (
									lgScreen ? (
										<Dropdown />
									) : (
										<button
											className="text-lg lg:text-xl font-medium focus:outline-none"
											onClick={() =>
												toggleAccountMenu(
													!isAccountMenuVisible
												)
											}
										>
											Account
										</button>
									)
								) : (
									<Link href="/login">
										<p className="text-lg lg:text-xl font-medium cursor-pointer my-4">
											Login
										</p>
									</Link>
								)}
							</>
						)}
					</div>
				)}
				<div className="hidden lg:flex justify-end items-center px-2">
					<input
						type="text"
						name="Search"
						className="lg:w-52 xl:w-60 text-lg rounded-l-lg bg-white dark:bg-gray-900 border-l-2 border-t-2 border-b-2 border-gray-400 dark:border-gray-600 focus:outline-none pl-4 py-1 my-3"
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
						className="text-white rounded-r-lg text-lg bg-purple-500 dark:bg-purple-600 border-2 border-purple-500 dark:border-purple-600 lg:mr-4 xl:mr-8 px-3 py-2 focus:outline-none"
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
