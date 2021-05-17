import React, { FC, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { NextRouter, withRouter } from "next/router";
import { FiMoon, FiSun } from "react-icons/fi";

import { firebase } from "../../../pages/_app";

interface DropdownProps {
	router: NextRouter;
}

const Dropdown: FC<DropdownProps> = ({ router }: DropdownProps) => {
	const [showMenu, toggleMenu] = useState(false);
	const { theme, setTheme } = useTheme();

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

	const dropdownLinkClass =
		"w-full flex items-center text-left font-medium font-semibold p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-700 hover:text-purple-600 dark:hover:text-purple-100 focus:outline-none active:bg-purple-200";
	return (
		<motion.div
			className="h-full flex flex-col justify-center"
			onHoverStart={() => {
				toggleMenu(true);
			}}
			onHoverEnd={() => {
				toggleMenu(false);
			}}
		>
			<p className="text-xl font-medium cursor-pointer">Account</p>
			{showMenu && (
				<motion.div className="absolute z-10 w-52 rounded-lg flex flex-col items-center p-2 top-14 right-8 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg">
					<button
						className={dropdownLinkClass}
						onClick={() =>
							setTheme(theme === "dark" ? "light" : "dark")
						}
					>
						Toggle Theme{" "}
						{
							<span
								className={`inline-block p-1 mx-2 rounded-full bg-gray-800 dark:bg-gray-50 text-white dark:text-black`}
							>
								{theme === "dark" ? (
									<FiSun size={16} />
								) : (
									<FiMoon size={16} />
								)}
							</span>
						}
					</button>
					<button className={dropdownLinkClass}>Settings</button>
					<button
						className={dropdownLinkClass}
						onClick={() => logout()}
					>
						Logout
					</button>
				</motion.div>
			)}
		</motion.div>
	);
};

export default withRouter(Dropdown);
