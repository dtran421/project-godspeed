import React, { FC, ReactNode } from "react";

import Footer from "../Navbar/Footer";
import Navbar from "../Navbar/Navbar";

interface MainLayoutProps {
	children: ReactNode;
	page: string;
	userStatus: boolean | null;
}

const MainLayout: FC<MainLayoutProps> = ({
	children,
	page,
	userStatus
}: MainLayoutProps) => {
	return (
		<div className="w-full min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-150 ease-in-out">
			<Navbar page={page} userStatus={userStatus} />
			{children}
			<Footer />
		</div>
	);
};

export default MainLayout;
