import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import { firebase } from "../../pages/_app";
import Navlink from "./Navlink";

interface NavbarProps {
	page: string;
	userStatus: boolean | null;
}

const pages = ["News", "Drops", "Dashboard"];

const Navbar: React.FunctionComponent<NavbarProps> = ({
	page,
	userStatus
}: NavbarProps) => {
	const router = useRouter();
	const [loggedIn, setLoggedIn] = useState(userStatus);
	const [showMenu, toggleMenu] = useState(false);

	useEffect(() => {
		let isMounted = false;
		if (userStatus === null && !isMounted) {
			firebase.auth().onAuthStateChanged(function (user) {
				if (user) {
					setLoggedIn(true);
				} else {
					if (page !== "Login") {
						router.push("/login");
					}
				}
			});
		}

		return () => {
			isMounted = true;
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
		<>
			<Head>
				<title>{page} | Godspeed</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="relative w-full bg-white border-gray-200 border-b-2">
				<div className="grid grid-cols-3 px-10 py-2">
					<Link href="/">
						<div className="flex items-center cursor-pointer">
							<div className="px-2">
								<Image
									width={40}
									height={45}
									src="/godspeed.png"
								/>
							</div>
							<h1 className="font-bold text-3xl">Godspeed</h1>
						</div>
					</Link>
					<div className="grid grid-cols-3 justify-center">
						{pages.map((text, index) => {
							return <Navlink key={index} text={text} />;
						})}
					</div>
					<div className="w-full flex justify-end items-center px-2">
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
										<motion.div
											className="absolute z-10 w-60 rounded-lg flex flex-col divide-y-2 divide-gray-600 p-2 top-16 right-8 bg-blue-100 border border-gray-300 shadow-md"
											onHoverStart={() => {
												toggleMenu(true);
											}}
											onHoverEnd={() => {
												toggleMenu(false);
											}}
										>
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
		</>
	);
};

export default Navbar;
