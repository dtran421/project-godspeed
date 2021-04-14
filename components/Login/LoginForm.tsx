import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";

import { firebase } from "../../pages/_app";
import { RegisterSchema, LoginSchema } from "./ValidationSchema";

const intialValues = {
	email: "",
	password: "",
	confirmPassword: ""
};

const LoginForm: React.FunctionComponent<Record<string, null>> = () => {
	const router = useRouter();

	const [mode, setMode] = useState("Login");
	const [loginError, updateError] = useState({});
	const [showPassword, togglePassword] = useState(false);

	const loginCredentials = (values, { setSubmitting }) => {
		firebase
			.auth()
			.signInWithEmailAndPassword(values.email, values.password)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log(user);
				firebase.auth().onAuthStateChanged((user) => {
					if (user) {
						router.push("/dashboard");
					} else {
						console.log("Something went wrong!");
						updateError({ message: "Something went wrong!" });
					}
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				updateError({ message: error.message });
				console.log(errorCode, errorMessage);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

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
				updateError({ message: error.message });
				console.log(errorCode, errorMessage);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const inputClass =
		"bg-blue-50 w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400";
	return (
		<Formik
			initialValues={intialValues}
			validationSchema={mode === "Login" ? LoginSchema : RegisterSchema}
			onSubmit={(values, { setSubmitting }) => {
				mode === "Login"
					? loginCredentials(values, { setSubmitting })
					: registerCredentials(values, {
							setSubmitting
					  });
			}}
		>
			{({ values, errors, touched, resetForm, isSubmitting }) => {
				return (
					<Form className="flex flex-col justify-center items-center px-3 w-full">
						{mode === "Register" && (
							<div className="w-full p-4">
								<span
									className="text-blue-500 cursor-pointer"
									onClick={() => {
										updateError({});
										resetForm();
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
						<div className="flex flex-col w-full justify-center px-6 pb-4 mx-10">
							<Error
								errors={
									"message" in loginError || mode === "Login"
										? loginError
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

							<InputHeader headerText={"Password"} />
							<div className="relative w-full">
								<Field
									name="password"
									type={showPassword ? "text" : "password"}
									className={`w-full ${inputClass}`}
								/>
								<button
									type="button"
									className="absolute right-0 top-0 vertical-align rounded-full bg-purple-400 px-2 py-1 mr-6 focus:outline-none"
									onClick={() =>
										togglePassword(!showPassword)
									}
								>
									i
								</button>
							</div>

							{mode === "Register" && (
								<>
									<InputHeader
										headerText={"Confirm Password"}
									/>
									<div className="relative w-full">
										<Field
											name="confirmPassword"
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
												togglePassword(!showPassword)
											}
										>
											i
										</button>
									</div>
								</>
							)}

							<button
								type="submit"
								className="block text-white text-center text-xl bg-purple-500 rounded-lg mt-8 mb-4 p-2 focus:outline-none active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={
									!(
										mode === "Login" ||
										(errors.email === undefined &&
											errors.password === undefined &&
											values.email &&
											values.password)
									) || isSubmitting
								}
							>
								Submit
							</button>
						</div>

						{mode === "Login" && (
							<div className="w-4/5 flex justify-center border-t border-black p-4">
								<span
									className="text-blue-500 cursor-pointer"
									onClick={() => {
										updateError({});
										resetForm();
										setMode("Register");
									}}
								>
									No account? Sign up
								</span>
							</div>
						)}
					</Form>
				);
			}}
		</Formik>
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

export default LoginForm;
