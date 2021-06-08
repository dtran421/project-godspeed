import React, { FC, useEffect } from "react";
import { NextRouter, withRouter } from "next/router";

import { firebase } from "./_app";
import UserLayout from "../components/Global/Layouts/UserLayout";
import LoginForm from "../components/Login/LoginForm";

interface LoginProps {
	router: NextRouter;
}

const Login: FC<LoginProps> = ({ router }: LoginProps) => {
	useEffect(() => {
		let isMounted = true;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (isMounted) {
					if (router.query && router.query.from) {
						router.push(router.query.from as string);
					} else {
						router.push("/dashboard");
					}
				}
			}
		});

		return () => {
			isMounted = false;
		};
	}, [router]);

	return (
		<UserLayout page={"Login"} userStatus={false}>
			<div className="w-full h-screen -mt-16">
				<div className="h-full flex justify-center items-center">
					<div className="w-3/4 md:w-2/5 lg:w-1/3 xl:w-1/4 flex justify-center items-center bg-white dark:bg-gray-900 rounded-lg shadow-lg">
						<LoginForm />
					</div>
				</div>
			</div>
		</UserLayout>
	);
};

export default withRouter(Login);
