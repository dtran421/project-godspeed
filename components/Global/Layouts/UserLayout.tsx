import React, { FC, ReactNode } from "react";

import Navbar from "../Navbar/Navbar";

interface UserLayoutProps {
	children: ReactNode;
	page: string;
	userStatus: boolean | null;
}

const UserLayout: FC<UserLayoutProps> = ({
	children,
	page,
	userStatus
}: UserLayoutProps) => {
	return (
		<div className="w-full min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-in-out">
			<Navbar page={page} userStatus={userStatus} />
			{children}
		</div>
	);
};

export default UserLayout;
