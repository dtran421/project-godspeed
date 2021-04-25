import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { NextRouter, withRouter } from "next/router";
import { motion } from "framer-motion";

import { firebase } from "../../pages/_app";
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
	const [showMenu, toggleMenu] = useState(false);

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

	const logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log("User signed out");
				router.push("/login");
			})
			.catch((error) => {
				console.log("Something went wrong: ", error);
			});
	};

	return (
		<div className="sticky top-0 h-16 bg-white z-20">
			<Head>
				<title>{page} | Godspeed</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="relative w-full bg-white border-gray-200 border-b-2">
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
							className="w-64 text-lg rounded-full border-2 border-gray-400 focus:outline-none pl-3 py-1 mx-8"
							placeholder={"Search"}
						/>
						{loggedIn ? (
							<>
								<motion.div
									className="flex flex-col justify-center h-full"
									onHoverStart={() => {
										toggleMenu(true);
									}}
									onHoverEnd={() => {
										toggleMenu(false);
									}}
								>
									<p className="text-xl font-medium cursor-pointer">
										Account
									</p>
									{showMenu && (
										<motion.div className="absolute z-10 w-60 rounded-lg flex flex-col divide-y-2 divide-gray-600 p-2 top-14 right-8 bg-blue-100 border border-gray-300 shadow-md">
											<p className="font-semibold px-2 py-3 cursor-pointer">
												Settings
											</p>
											<p
												className="font-semibold px-2 py-3 cursor-pointer"
												onClick={() => logout()}
											>
												Logout
											</p>
										</motion.div>
									)}
								</motion.div>
							</>
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
