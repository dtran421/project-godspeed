import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { firebase } from "./_app";
import Navbar from "../components/Global/Navbar";
import LoginForm from "../components/Login/LoginForm";

const Login: React.FunctionComponent<null> = () => {
	const router = useRouter();

	useEffect(() => {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				router.push("/dashboard");
			} else {
				router.push("/login");
			}
		});
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

export default Login;
