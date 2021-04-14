import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { firebase, db } from "../../pages/_app";

interface WatchlistListProps {
	lists: string[];
	active: number;
	setList: React.Dispatch<React.SetStateAction<number>>;
	updateWatchlistsAfterCreation: (lists: string[]) => void;
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
	const [showInput, toggleInput] = useState(false);
	const [creationError, setCreationError] = useState({});

	const createNewList = (values, { setSubmitting }) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				db.collection("watchlists")
					.doc(user.uid)
					.update({
						[values.listName]: { shoes: [] }
					})
					.then(() => {
						console.log("Document successfully written!");
						toggleInput(!showInput);
						setSubmitting(false);
						lists.push(values.listName);
						updateWatchlistsAfterCreation(lists);
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
		<div className="w-1/4 inline-block bg-white shadow-lg rounded-lg mr-10 py-8">
			<h1 className="text-2xl text-center font-semibold pb-8">
				Watchlists
			</h1>
			{lists.length > 0 ? (
				lists.map((listName, index) => {
					return (
						<div
							key={index}
							className={`border-l-4 ${
								active === index
									? "border-purple-600 bg-purple-100"
									: "border-transparent"
							} cursor-pointer`}
							onClick={() => {
								setList(index);
							}}
						>
							<p className="text-lg px-6 py-2">{listName}</p>
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
						className="rounded-full border-2 border-purple-600 text-purple-600 font-medium text-lg mx-6 px-6 py-1 focus:outline-none hover:bg-purple-600 hover:text-white"
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
						{({ errors, touched, resetForm, isSubmitting }) => {
							return (
								<Form className="mx-6">
									<div>
										<Field
											name="listName"
											placeholder="List Name"
											className="bg-blue-50 rounded-lg border-2 border-blue-300 font-medium text-lg pl-3 py-2 focus:outline-none focus:border-purple-400"
										/>
										<div className="w-full grid grid-cols-2 gap-2 my-3">
											<button
												type="button"
												className="text-lg rounded-lg border-2 border-purple-600 text-purple-600 py-1 px-2 focus:outline-none"
												onClick={() => {
													toggleInput(!showInput);
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
