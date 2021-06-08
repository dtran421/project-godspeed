import React, {
	FC,
	Dispatch,
	SetStateAction,
	useState,
	useEffect
} from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import PulseLoader from "react-spinners/PulseLoader";
import { FiList, FiX } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";

import { firebase, db } from "../../pages/_app";
import { ListSchema } from "../Global/Configs/ValidationSchema";
import { lgScreenQuery } from "../Global/Configs/Breakpoints";

interface WatchlistListProps {
	isFetching: boolean;
	lists: string[];
	active: number;
	setList: Dispatch<SetStateAction<number>>;
	updateWatchlistsAfterCreation: (
		newList: string,
		creationDate: Date
	) => void;
}

const WatchlistList: FC<WatchlistListProps> = ({
	isFetching,
	lists,
	active,
	setList,
	updateWatchlistsAfterCreation
}: WatchlistListProps) => {
	const router = useRouter();

	const lgScreen = useMediaQuery(lgScreenQuery);

	const [isExpanded, toggleExpanded] = useState(true);
	useEffect(() => {
		toggleExpanded(true);
	}, [lgScreen]);

	const [showInput, toggleInput] = useState(false);
	const [creationError, setCreationError] = useState({});

	const createNewList = ({ listName }, { setSubmitting }) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const creationDate = new Date();
				db.collection("watchlists")
					.doc(user.uid)
					.collection("lists")
					.doc(listName)
					.set(
						{
							shoes: {},
							created: creationDate
						},
						{ merge: true }
					)
					.then(() => {
						console.log("Document successfully written!");
						toggleInput(!showInput);
						setSubmitting(false);
						updateWatchlistsAfterCreation(listName, creationDate);
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
		<>
			<div className="fixed lg:hidden z-20 left-3 top-20 mb-4">
				<button
					className="flex justify-center items-center rounded-full shadow-lg text-white bg-purple-600 focus:outline-none p-3"
					onClick={() => toggleExpanded(!isExpanded)}
				>
					{isExpanded ? <FiX size={20} /> : <FiList size={20} />}
				</button>
			</div>
			{isExpanded && (
				<div
					className={`fixed left-0 top-16 h-full ${
						isExpanded ? "w-2/3 md:w-1/3" : "w-1/5"
					} lg:w-1/4 xl:w-1/6 z-10 bg-white dark:bg-gray-900 transition-all duration-100 shadow-lg border-r-2 border-gray-200 dark:border-gray-700 py-2`}
				>
					<div className="my-16 lg:my-6">
						<h1 className="text-2xl text-center font-semibold mb-4">
							Watchlists
						</h1>
						{isFetching ? (
							<div className="flex justify-center mt-6">
								<PulseLoader color={"#7C3AED"} margin={6} />
							</div>
						) : lists.length > 0 ? (
							lists.map((listName, index) => {
								return (
									<div
										key={index}
										className={`border-l-4 ${
											active === index
												? "border-purple-600 dark:border-purple-500 bg-purple-100 dark:bg-purple-700 dark:bg-opacity-40"
												: "border-transparent"
										} cursor-pointer`}
										onClick={() => {
											setList(index);
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
								<p className="text-lg text-center text-gray-700 dark:text-gray-300 p-4 mx-4 mb-6">
									No watchlists yet. Create your first one:
								</p>
							</div>
						)}
						<div className="mt-8 text-center">
							{!showInput && (
								<button
									className="rounded-full border-2 border-purple-600 text-purple-600 dark:text-white font-medium text-lg px-6 lg:px-8 py-1 lg:py-2 focus:outline-none hover:bg-purple-600 hover:text-white"
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
										createNewList(values, {
											setSubmitting
										});
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
														className="w-full bg-white dark:bg-gray-900 rounded-lg font-medium pl-3 py-2 border-2 border-gray-400 dark:border-gray-600 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500"
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
															disabled={
																isSubmitting
															}
														>
															Create
														</button>
													</div>
												</div>
												<Error
													errors={
														"message" in
														creationError
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
				</div>
			)}
		</>
	);
};

export interface ErrorProps {
	errors: Record<string, string>;
	touched: Record<string, boolean>;
}

export const Error: FC<ErrorProps> = ({ errors, touched }: ErrorProps) => {
	let message;
	if (errors.creation) message = errors.creation;
	else if (errors.listName && touched.listName) message = errors.listName;
	else message = errors.message;

	return message ? (
		<p className="px-2 py-2 mt-4 text-left border-l-4 border-red-500 dark:border-red-600 bg-red-100 dark:bg-red-900 dark:bg-opacity-50">
			{message}
		</p>
	) : null;
};

export default WatchlistList;
