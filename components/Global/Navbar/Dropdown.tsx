import React, { FC, useState } from "react";
import Link from "next/link";
import { NextRouter, withRouter } from "next/router";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { FiLogOut, FiMoon, FiSettings, FiSun } from "react-icons/fi";

import { firebase } from "../../../pages/_app";

const dropdownVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.15
		}
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.3
		}
	}
};

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
				router.push("/login", "/login");
			})
			.catch((error) => {
				console.log("Something went wrong: ", error);
			});
	};

	const dropdownLinkClass =
		"w-full flex items-center text-left font-medium p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-700 hover:text-purple-600 dark:hover:text-purple-100 focus:outline-none active:bg-purple-200";
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
			<p className="text-xl font-medium cursor-default">Account</p>
			<AnimatePresence>
				{showMenu && (
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={dropdownVariants}
						className="absolute z-40 top-18 right-8 w-52 flex flex-col items-center bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg p-2"
					>
						<button
							className={dropdownLinkClass}
							onClick={() =>
								setTheme(theme === "dark" ? "light" : "dark")
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
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default withRouter(Dropdown);
