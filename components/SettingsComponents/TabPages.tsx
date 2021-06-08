import React, { FC, useState, Dispatch, SetStateAction } from "react";
import { useTheme } from "next-themes";
import { Formik, Form, Field } from "formik";
import { BsCaretRightFill } from "react-icons/bs";
import MoonLoader from "react-spinners/MoonLoader";

import { firebase } from "../../pages/_app";
import { UserInfo } from "../../pages/api/StructureTypes";
import { UserInfoSchema } from "../Global/Configs/ValidationSchema";
import { Error } from "../Login/LoginForm";

interface GeneralTabProps {
	isFetching: boolean;
	userInfo: {
		name: string;
		email: string;
	};
	updateUserInfo: Dispatch<SetStateAction<[boolean, UserInfo]>>;
}

export const GeneralTab: FC<GeneralTabProps> = ({
	isFetching,
	userInfo,
	updateUserInfo
}: GeneralTabProps) => {
	const { theme } = useTheme();

	const [editMode, setEditMode] = useState(false);
	const [editError, setError] = useState<Record<string, string>>({});

	const submitUserInfo = ({ name, email }, setSubmitting) => {
		firebase.auth().onAuthStateChanged(async (user) => {
			if (user) {
				const updateRequests = [];
				if (name !== userInfo.name) {
					updateRequests.push(
						new Promise((resolve) => {
							user.updateProfile({ displayName: name })
								.then(() => {
									console.log("name updated!");
									resolve(name);
								})
								.catch((error) => {
									console.error(error);
									setError({ message: error.message });
									resolve(userInfo.name);
								});
						})
					);
				}
				if (email !== userInfo.email) {
					updateRequests.push(
						new Promise((resolve) => {
							user.updateEmail(email)
								.then(() => {
									console.log("email updated!");
									resolve(email);
								})
								.catch((error) => {
									console.error(error);
									setError({ message: error.message });
									resolve(userInfo.email);
								});
						})
					);
				}
				await Promise.all(updateRequests);
				updateUserInfo([
					false,
					{ name: updateRequests[0], email: updateRequests[1] }
				]);
				setSubmitting(false);
				setEditMode(false);
			}
		});
	};

	return isFetching ? (
		<div className="h-full flex justify-center items-center">
			<MoonLoader color={theme === "dark" ? "#8B5CF6" : "#7C3AED"} />
		</div>
	) : (
		<Formik
			initialValues={userInfo}
			enableReinitialize
			validationSchema={UserInfoSchema}
			onSubmit={(values, { setSubmitting }) => {
				submitUserInfo(values, setSubmitting);
			}}
		>
			{({ touched, errors, resetForm, isSubmitting }) => {
				return (
					<Form className="h-full">
						<div className="h-full flex flex-col justify-between px-14 py-8">
							<div className="flex flex-col">
								<h1
									className={`text-2xl font-medium ${
										!editError.message && "mb-8"
									}`}
								>
									General
								</h1>
								<div className="mt-1">
									<Error
										errors={
											"message" in editError
												? editError
												: errors
										}
										touched={touched}
									/>
								</div>
								<GeneralField
									editMode={editMode}
									label={"Name"}
									defaultValue={userInfo.name}
								/>
								<GeneralField
									editMode={editMode}
									label={"Email"}
									defaultValue={userInfo.email}
								/>
							</div>
							<div className="flex justify-end">
								{editMode ? (
									<div className="grid grid-cols-2 gap-x-4">
										<button
											type="button"
											className="text-xl rounded-xl border-2 border-purple-500 dark:border-purple-600 focus:outline-none px-6 py-2"
											onClick={() => {
												resetForm();
												setEditMode(false);
												setError({});
											}}
										>
											Cancel
										</button>
										{isSubmitting ? (
											<div className="flex items-center justify-center rounded-xl bg-purple-500 dark:bg-purple-600">
												<MoonLoader
													color="#FFFFFF"
													size={24}
												/>
											</div>
										) : (
											<button
												type="submit"
												className="text-xl rounded-xl text-white bg-purple-500 dark:bg-purple-600 focus:outline-none px-6 py-2"
											>
												Save
											</button>
										)}
									</div>
								) : (
									<button
										type="button"
										className="text-xl font-medium rounded-xl text-white bg-purple-500 dark:bg-purple-600 border-2 border-transparent focus:outline-none px-8 py-2"
										onClick={() => setEditMode(true)}
									>
										Edit
									</button>
								)}
							</div>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
};

interface GeneralFieldProps {
	editMode: boolean;
	label: string;
	defaultValue: string;
}

const GeneralField: FC<GeneralFieldProps> = ({
	editMode,
	label,
	defaultValue
}: GeneralFieldProps) => {
	const inputClass =
		"w-1/2 bg-blue-50 dark:bg-gray-800 dark:border-2 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 p-2";
	return (
		<div className="mb-8">
			<p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
				{label}
			</p>
			<p className="flex items-center text-xl">
				<span className="text-purple-600 mr-1">
					<BsCaretRightFill />
				</span>
				{editMode ? (
					<Field
						name={label.toLowerCase()}
						type={
							label.toLowerCase() === "email" ? "email" : "text"
						}
						className={inputClass}
					/>
				) : (
					defaultValue || "Not provided"
				)}
			</p>
		</div>
	);
};

export const SecurityTab: FC<Record<string, unknown>> = () => {
	return (
		<div className="h-full flex items-center justify-center">
			<p className="text-xl font-semibold">Under development</p>
		</div>
	);
};

export const ConnectTab: FC<Record<string, unknown>> = () => {
	return (
		<div className="h-full flex items-center justify-center">
			<p className="text-xl font-semibold">Under development</p>
		</div>
	);
};
