import React, { useEffect } from "react";
import { NextRouter, withRouter } from "next/router";

import { firebase } from "./_app";
import UserLayout from "../components/Global/Layouts/UserLayout";
import LoginForm from "../components/Login/LoginForm";

interface LoginProps {
	router: NextRouter;
}

const Login: React.FunctionComponent<LoginProps> = ({ router }: LoginProps) => {
	useEffect(() => {
		let isMounted = true;
		firebase.auth().onAuthStateChanged(function (user) {
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
	}, []);

	return (
		<UserLayout page={"Login"} userStatus={false}>
			<div className="w-full h-screen">
				<div className="h-full flex justify-center items-center">
					<div className="flex flex-col justify-center items-center max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-lg">
						<LoginForm />
					</div>
				</div>
			</div>
		</UserLayout>
	);
};

export default withRouter(Login);
