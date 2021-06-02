import React, { FC, useState, useEffect } from "react";
import { NextRouter, withRouter } from "next/router";

import { firebase } from "./_app";
import UserLayout from "../components/Global/Layouts/UserLayout";
import LoginForm from "../components/Login/LoginForm";

interface LoginProps {
	router: NextRouter;
}

const Login: FC<LoginProps> = ({ router }: LoginProps) => {
	const [isMounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
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
			setMounted(false);
		};
	}, []);

	return isMounted ? (
		<UserLayout page={"Login"} userStatus={false}>
			<div className="w-full h-screen -mt-16">
				<div className="h-full flex justify-center items-center">
					<div className="w-1/4 flex flex-col justify-center items-center max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-lg">
						<LoginForm />
					</div>
				</div>
			</div>
		</UserLayout>
	) : null;
};

export default withRouter(Login);
