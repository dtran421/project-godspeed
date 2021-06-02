import React, { FC, useState, useEffect } from "react";
import { withRouter, NextRouter } from "next/router";

import { firebase } from "./_app";
import UserLayout from "../components/Global/Layouts/UserLayout";
import { UserInfo } from "./api/StructureTypes";
import {
	GeneralTab,
	SecurityTab,
	ConnectTab
} from "../components/SettingsComponents/TabPages";
import { FiAtSign, FiShield, FiUser } from "react-icons/fi";

const tabs = [
	{ label: "General", icon: <FiUser /> },
	{ label: "Security", icon: <FiShield /> },
	{ label: "Connect", icon: <FiAtSign /> }
];

interface SettingsProps {
	router: NextRouter;
}

const Settings: FC<SettingsProps> = ({ router }: SettingsProps) => {
	const [isMounted, setMounted] = useState(true);

	const [activeTab, setActiveTab] = useState(0);
	const [[isFetching, userInfo], updateUserInfo] = useState<
		[boolean, UserInfo]
	>([true, {} as UserInfo]);
	useEffect(() => {
		setMounted(true);
		firebase.auth().onAuthStateChanged((user) => {
			if (isMounted) {
				if (user) {
					const { displayName: name, email } = user;
					updateUserInfo([false, { name, email }]);
				} else {
					router.push({
						pathname: "/login",
						query: { from: router.pathname }
					});
				}
			}
		});

		return () => {
			setMounted(false);
		};
	}, []);

	let displayTab;
	switch (activeTab) {
		case 0:
			displayTab = (
				<GeneralTab
					isFetching={isFetching}
					userInfo={userInfo}
					updateUserInfo={updateUserInfo}
				/>
			);
			break;
		case 1:
			displayTab = <SecurityTab />;
			break;
		default:
			displayTab = <ConnectTab />;
			break;
	}

	let greeting;
	const currTime = new Date().getHours();
	if (currTime < 12) {
		greeting = "morning";
	} else if (currTime < 18) {
		greeting = "afternoon";
	} else {
		greeting = "evening";
	}

	return (
		<UserLayout page={"Settings"} userStatus={true}>
			<div className="h-screen max-w-6xl mx-auto flex flex-col justify-center -mt-16">
				<h1 className="text-5xl font-semibold mt-10 mb-6">Settings</h1>
				<div className="h-3/4 grid grid-cols-4 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700">
					<div className="flex flex-col bg-gray-200 dark:bg-gray-900 py-4">
						<div className="flex px-6 pt-2 pb-6 mb-6">
							<h2 className="text-2xl font-medium">
								Good {greeting},{" "}
								{userInfo.name
									? userInfo.name.split(" ")[0]
									: ""}
							</h2>
						</div>
						{tabs.map((tabInfo, index) => {
							return (
								<button
									key={index}
									className={`flex items-center text-xl text-left font-semibold px-6 py-4 border-l-4 focus:outline-none transition-colors duration-200 ease-in-out ${
										activeTab === index
											? "bg-white dark:bg-black border-purple-600 cursor-default"
											: "border-transparent"
									}`}
									onClick={() => setActiveTab(index)}
								>
									<span
										className={`${
											activeTab === index
												? "text-white bg-purple-500 dark:bg-purple-600 bg-opacity-90"
												: "bg-gray-300 dark:bg-gray-700 dark:bg-opacity-80"
										} rounded-xl p-2 mr-4 transition-colors duration-200 ease-in`}
									>
										{tabInfo.icon}
									</span>
									{tabInfo.label}
								</button>
							);
						})}
					</div>
					<div className="col-span-3 rounded-2xl">{displayTab}</div>
				</div>
			</div>
		</UserLayout>
	);
};

export default withRouter(Settings);
