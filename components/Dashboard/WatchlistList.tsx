import React, { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import { firebase, db } from "../../pages/_app";

interface WatchlistListProps {
	lists: string[];
	active: number;
	setList: React.Dispatch<React.SetStateAction<number>>;
	updateWatchlistsAfterCreation: (newList: string) => void;
}

const ListSchema = Yup.object().shape({
	listName: Yup.string().required("Please enter a name")
});

const WatchlistList: React.FunctionComponent<WatchlistListProps> = ({
	lists,
	active,
	setList,
	updateWatchlistsAfterCreation
}: WatchlistListProps) => {
	const router = useRouter();

	const [showMenu, toggleMenu] = useState(lists.length > 0 ? false : true);

	const [showInput, toggleInput] = useState(false);
	const [creationError, setCreationError] = useState({});

	const createNewList = ({ listName }, { setSubmitting }) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				db.collection("watchlists")
					.doc(user.uid)
					.collection("lists")
					.doc(listName)
					.set(
						{
							shoes: {}
						},
						{ merge: true }
					)
					.then(() => {
						console.log("Document successfully written!");
						toggleInput(!showInput);
						setSubmitting(false);
						updateWatchlistsAfterCreation(listName);
					})
					.catch((error) => {
						console.error("Error writing document: ", error);
						setCreationError({ message: error });
						setSubmitting(false);
					});
			} else {
				router.push("/login");
			}
		});
	};

	return (
		<div
			className={`fixed left-0 top-16 h-full z-10 ${
				showMenu ? "w-1/6" : "w-16"
			} bg-white dark:bg-gray-900 transition-colors duration-100 shadow-lg border-r border-gray-200 dark:border-gray-700 py-2`}
		>
			<div className={`${showMenu ? "px-6" : "px-2"} my-4`}>
				<button
					className="flex items-center justify-center w-full rounded-md py-1 border border-gray-700 text-lg font-medium focus:outline-none"
					onClick={() => toggleMenu(!showMenu)}
				>
					{showMenu ? (
						<>
							<FiArrowLeft size={24} className="mr-2" />{" "}
							{"Collapse"}
						</>
					) : (
						<FiArrowRight size={24} />
					)}
				</button>
			</div>
			{showMenu && (
				<>
					<h1 className="text-2xl text-center font-semibold mb-4">
						Watchlists
					</h1>
					{lists.length > 0 ? (
						lists.map((listName, index) => {
							return (
								<div
									key={index}
									className={`border-l-4 ${
										active === index
											? "border-purple-600 dark:border-purple-800 bg-purple-100 dark:bg-purple-600 dark:bg-opacity-40"
											: "border-transparent"
									} cursor-pointer`}
									onClick={() => {
										setList(index);
										toggleMenu(!showMenu);
									}}
								>
									<p className="text-lg px-6 py-2">
										{listName}
									</p>
								</div>
							);
						})
					) : (
						<div>
							<p className="text-lg text-center text-gray-700 p-4 mx-4 mb-6">
								No watchlists yet. Create your first one:
							</p>
						</div>
					)}
					<div className="mt-8 text-center">
						{!showInput && (
							<button
								className="rounded-full border-2 border-purple-600 text-purple-600 dark:text-white font-medium text-lg px-8 py-2 focus:outline-none hover:bg-purple-600 hover:text-white"
								onClick={() => toggleInput(!showInput)}
							>
								New list
							</button>
						)}
						{showInput && (
							<Formik
								initialValues={{ listName: "" }}
								validationSchema={ListSchema}
								onSubmit={(values, { setSubmitting }) => {
									createNewList(values, { setSubmitting });
								}}
							>
								{({
									errors,
									touched,
									resetForm,
									isSubmitting
								}) => {
									return (
										<Form className="px-4">
											<div>
												<Field
													name="listName"
													placeholder="List Name"
													className="bg-blue-50 dark:bg-gray-700 rounded-lg border-2 border-blue-300 font-medium pl-3 py-2 focus:outline-none focus:border-purple-400 dark:focus:border-"
												/>
												<div className="w-full grid grid-cols-2 gap-2 my-3">
													<button
														type="button"
														className="text-lg rounded-lg border-2 border-purple-600 text-purple-600 dark:text-white px-1 focus:outline-none"
														onClick={() => {
															toggleInput(
																!showInput
															);
															resetForm();
														}}
													>
														Cancel
													</button>
													<button
														type="submit"
														className="text-lg font-medium rounded-lg bg-purple-600 text-white py-1 px-2 focus:outline-none disabled:cursor-not-allowed"
														disabled={isSubmitting}
													>
														Create
													</button>
												</div>
											</div>
											<Error
												errors={
													"message" in creationError
														? creationError
														: errors
												}
												touched={touched}
											/>
										</Form>
									);
								}}
							</Formik>
						)}
					</div>
				</>
			)}
		</div>
	);
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
	else if (errors.listName && touched.listName) message = errors.listName;

	return message ? (
		<p className="px-2 py-2 mt-4 text-left border-l-4 border-red-500 bg-red-100">
			{message}
		</p>
	) : null;
};

export default WatchlistList;
