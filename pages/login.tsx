import React from "react";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { firebase } from "./_app";
import Navbar from "../components/Global/Navbar";

export interface LoginProps {
	test: number;
}

const intialValues = {
	email: "",
	password: "",
	confirmPassword: ""
};

const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email required"),
	password: Yup.string()
		.required("Please provide a password")
		.min(8, "Password must contain at least 8 characters")
		.matches(
			/^.*(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
			"Password must contain at least one uppercase and one number"
		)
});

const SignupSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email required"),
	password: Yup.string()
		.required("Please provide a password")
		.min(8, "Password must contain at least 8 characters")
		.matches(
			/^.*(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
			"Password must contain at least one uppercase and one number"
		),
	confirmPassword: Yup.string()
		.required("Please confirm your password")
		.when("password", {
			is: (password) => (password && password.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref("password")],
				"Passwords don't match"
			)
		})
});

const Login: React.FunctionComponent<LoginProps> = () => {
	const [mode, setMode] = useState("Login");
	const [showPassword, togglePassword] = useState(false);
	const [creationError, updateError] = useState({});

	const registerCredentials = (values, { setSubmitting }) => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(values.email, values.password)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log(user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				updateError({ creation: error.message });
				console.log(errorCode, errorMessage);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const inputClass =
		"bg-blue-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400";
	return (
		<div>
			<div className="flex flex-col w-full min-h-screen bg-gray-100">
				<Navbar page={"Login"} />
				<div className="flex flex-1 w-full items-center justify-center">
					<div className="flex flex-col justify-center items-center w-1/4 bg-white rounded-lg shadow-lg">
						{mode === "Register" && (
							<div className="w-full p-4">
								<span
									className="text-blue-500 cursor-pointer"
									onClick={() => {
										updateError({});
										setMode("Login");
									}}
								>
									{"<-- Back to Login"}
								</span>
							</div>
						)}
						<h1
							className={`text-2xl text-center font-bold px-8 ${
								mode === "Login" ? "pt-8" : ""
							} pb-4`}
						>
							{mode}
						</h1>
						<div className="pb-4 px-14 w-full">
							<Formik
								initialValues={intialValues}
								validationSchema={
									mode === "Login"
										? LoginSchema
										: SignupSchema
								}
								onSubmit={(values, { setSubmitting }) => {
									mode === "Login"
										? ""
										: registerCredentials(values, {
												setSubmitting
										  });
								}}
							>
								{({ errors, touched }) => {
									return (
										<Form className="flex flex-col">
											<Error
												errors={
													"creation" in creationError
														? creationError
														: errors
												}
												touched={touched}
											/>
											<InputHeader headerText={"Email"} />
											<Field
												name="email"
												type="email"
												className={inputClass}
											/>

											<InputHeader
												headerText={"Password"}
											/>
											<div className="relative w-full">
												<Field
													name="password"
													type={
														showPassword
															? "text"
															: "password"
													}
													className={`w-full ${inputClass}`}
												/>
												<button
													type="button"
													className="absolute right-0 top-0 vertical-align rounded-full bg-purple-400 px-2 py-1 mr-6 focus:outline-none"
													onClick={() =>
														togglePassword(
															!showPassword
														)
													}
												>
													i
												</button>
											</div>

											{mode === "Register" && (
												<>
													<InputHeader
														headerText={
															"Confirm Password"
														}
													/>
													<Field
														name="confirmPassword"
														className={inputClass}
													/>
												</>
											)}

											<button
												type="submit"
												className="text-white text-xl bg-purple-500 rounded-lg mt-8 mb-4 p-2 focus:outline-none active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
												disabled={
													!(
														errors.email ===
															undefined &&
														errors.password ===
															undefined &&
														touched.email &&
														touched.password
													)
												}
											>
												Submit
											</button>
										</Form>
									);
								}}
							</Formik>
						</div>
						{mode === "Login" && (
							<div className="w-4/5 flex justify-center border-t border-black p-4">
								<span
									className="text-blue-500 cursor-pointer"
									onClick={() => {
										updateError({});
										setMode("Register");
									}}
								>
									No account? Sign up
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export interface HeaderProps {
	headerText: string;
}

const InputHeader: React.FunctionComponent<HeaderProps> = ({
	headerText
}: HeaderProps) => {
	return <p className="text-xl mt-4 mb-1">{headerText}</p>;
};

export interface ErrorProps {
	errors: Record<string, string>;
	touched: Record<string, boolean>;
}

const Error: React.FunctionComponent<ErrorProps> = ({
	errors,
	touched
}: ErrorProps) => {
	let message;
	if (errors.creation) message = errors.creation;
	else if (errors.email && touched.email) message = errors.email;
	else if (errors.password && touched.password) message = errors.password;
	else if (errors.confirmPassword && touched.confirmPassword)
		message = errors.confirmPassword;

	return message ? (
		<p className="px-2 py-2 mt-2 mb-4 border-l-4 border-red-500 bg-red-100">
			{message}
		</p>
	) : null;
};

export default Login;
