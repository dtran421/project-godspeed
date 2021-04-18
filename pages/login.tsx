import React, { useEffect } from "react";
import { NextRouter, withRouter } from "next/router";

import { firebase } from "./_app";
import Navbar from "../components/Global/Navbar";
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
		<div>
			<div className="flex flex-col w-full min-h-screen bg-gray-100">
				<Navbar page={"Login"} userStatus={false} />
				<div className="flex flex-1 w-full items-center justify-center">
					<div className="flex flex-col justify-center items-center max-w-lg bg-white rounded-lg shadow-lg">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Login);
