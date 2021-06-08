import React, {
	FC,
	Dispatch,
	SetStateAction,
	useState,
	useEffect
} from "react";
import { NextRouter, withRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { BsArrowLeft } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { firebase } from "../../pages/_app";
import {
	RegisterSchema,
	LoginSchema
} from "../Global/Configs/ValidationSchema";

const intialValues = {
	email: "",
	password: "",
	confirmPassword: ""
};

interface LoginFormProps {
	router: NextRouter;
}

const LoginForm: FC<LoginFormProps> = ({ router }: LoginFormProps) => {
	const googleProvider = new firebase.auth.GoogleAuthProvider();
	useEffect(() => {
		firebase
			.auth()
			.getRedirectResult()
			.then((result) => {
				const credential: firebase.auth.OAuthCredential =
					result.credential;
				if (credential) {
					// This gives you a Google Access Token. You can use it to access the Google API.
					const token = credential.accessToken;
					if (router.query && router.query.from) {
						router.push(router.query.from as string);
					} else {
						router.push("/dashboard");
					}
				}
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				updateError({ message: errorMessage });
				console.log(errorCode, errorMessage);
			});
	});

	const [mode, setMode] = useState("login");
	const [loginError, updateError] = useState({ message: "" });
	const [showPassword, togglePassword] = useState(false);

	const loginCredentials = ({ email, password }, setSubmitting) => {
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((/* userCredential */) => {
				// const user = userCredential.user;
				if (router.query && router.query.from) {
					router.push(router.query.from as string);
				} else {
					router.push("/dashboard");
				}
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				updateError({ message: errorMessage });
				console.log(errorCode, errorMessage);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const registerCredentials = (values, setSubmitting) => {
		firebase
			.auth()
			.createUserWithEmailAndPassword(values.email, values.password)
			.then((userCredential) => {
				const user = userCredential.user;
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

	const loginWithGoogle = () => {
		firebase.auth().signInWithRedirect(googleProvider);
	};

	const inputClass =
		"w-full bg-blue-50 dark:bg-gray-800 dark:border-2 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-40 p-1 lg:p-2";
	const socialButtonClass =
		"w-full flex items-center justify-center text-sm md:text-md font-medium rounded-full shadow-lg text-gray-800 bg-white border border-gray-300 dark:border-gray-700 focus:outline-none px-4 lg:px-6 py-2 my-2";
	return (
		<Formik
			initialValues={intialValues}
			validationSchema={mode === "login" ? LoginSchema : RegisterSchema}
			onSubmit={(values, { setSubmitting }) => {
				mode === "login"
					? loginCredentials(values, setSubmitting)
					: registerCredentials(values, setSubmitting);
			}}
		>
			{({
				values,
				errors,
				touched,
				resetForm,
				handleChange,
				isSubmitting
			}) => {
				return (
					<Form className="w-full flex flex-col justify-center items-center px-3">
						{mode === "register" && (
							<div className="w-full p-4">
								<p
									className="flex items-center text-blue-500 cursor-pointer"
									onClick={() => {
										updateError({ message: "" });
										resetForm();
										setMode("login");
									}}
								>
									<BsArrowLeft size={24} className="mr-1" />{" "}
									Back to Login
								</p>
							</div>
						)}
						<h1
							className={`text-xl lg:text-2xl text-center font-bold px-8 ${
								mode === "login" ? "pt-8" : ""
							} pb-2 lg:pb-4`}
						>
							{mode === "login" ? "Login" : "Register"}
						</h1>
						<div className="flex flex-col w-full justify-center px-6 pb-2 lg:pb-4 mx-10">
							<Error
								errors={
									mode === "login" || loginError.message
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
								onChange={(e) => {
									handleChange(e);
									updateError({ message: "" });
								}}
							/>
							<InputHeader headerText={"Password"} />
							<div className="relative w-full">
								<Field
									name="password"
									type={showPassword ? "text" : "password"}
									className={`w-full ${inputClass}`}
									onChange={(e) => {
										handleChange(e);
										updateError({ message: "" });
									}}
								/>
								<PasswordToggle
									showPassword={showPassword}
									togglePassword={togglePassword}
								/>
							</div>
							{mode === "register" && (
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
										<PasswordToggle
											showPassword={showPassword}
											togglePassword={togglePassword}
										/>
									</div>
								</>
							)}
							<button
								type="submit"
								className="block text-lg lg:text-xl text-center text-white bg-purple-500 rounded-lg focus:outline-none active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 mt-6 lg:mt-8 mb-4"
								disabled={
									!(
										mode === "login" ||
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
						{mode === "login" && (
							<div className="w-4/5 flex flex-col items-center border-t border-black dark:border-white p-2 lg:p-4">
								<button
									type="button"
									className={socialButtonClass}
									onClick={() => loginWithGoogle()}
								>
									Sign In with Google
									<img
										src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png"
										width={20}
										className="ml-2"
									/>
								</button>
								{/* <button
									type="button"
									className={socialButtonClass}
								>
									Sign In with Twitter
									<img
										src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
										width={25}
										className="ml-2"
									/>
								</button>
								<button
									type="button"
									className={socialButtonClass}
								>
									Sign In with Apple
									<img
										src="https://www.transparentpng.com/thumb/apple-logo/d9RxbG-apple-logo-free-png.png"
										width={20}
										className="ml-2"
									/>
								</button> */}
								<span
									className="text-blue-500 cursor-pointer my-2"
									onClick={() => {
										updateError({ message: "" });
										resetForm();
										setMode("register");
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

const InputHeader: FC<HeaderProps> = ({ headerText }: HeaderProps) => {
	return <p className="text-lg lg:text-xl mt-2 lg:mt-4 mb-1">{headerText}</p>;
};

interface ErrorProps {
	errors: Record<string, string>;
	touched: Record<string, boolean>;
}

export const Error: FC<ErrorProps> = ({ errors, touched }: ErrorProps) => {
	let message;
	if (errors.creation) message = errors.creation;
	else if (errors.email && touched.email) message = errors.email;
	else if (errors.password && touched.password) message = errors.password;
	else if (errors.confirmPassword && touched.confirmPassword)
		message = errors.confirmPassword;
	else if (errors.message) {
		message = errors.message;
	} else {
		message = null;
	}

	return message ? (
		<p className="px-2 py-2 mt-2 mb-4 border-l-4 border-red-500 dark:border-red-600 bg-red-100 dark:bg-red-900 dark:bg-opacity-50">
			{message}
		</p>
	) : null;
};

interface PasswordToggleProps {
	showPassword: boolean;
	togglePassword: Dispatch<SetStateAction<boolean>>;
}

const PasswordToggle: FC<PasswordToggleProps> = ({
	showPassword,
	togglePassword
}: PasswordToggleProps) => {
	const iconClass =
		"text-purple-500 dark:text-purple-600 opacity-75 dark:opacity-90 active:text-purple-700 dark:active:text-purple-800";
	return (
		<button
			type="button"
			className="absolute right-0 top-0 vertical-align rounded-full px-2 py-1 mr-2 focus:outline-none"
			onClick={() => togglePassword(!showPassword)}
		>
			{showPassword ? (
				<FiEyeOff className={iconClass} size={20} />
			) : (
				<FiEye className={iconClass} size={20} />
			)}
		</button>
	);
};

export default withRouter(LoginForm);
