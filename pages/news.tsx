import React from "react";
import { GetStaticProps } from "next";
import cheerio from "cheerio";

import { months } from "./drops";
import Navbar from "../components/Global/Navbar";

interface StoryInfo {
	headline: string;
	link: string;
	postTime: string;
	imageUrl: string;
}

interface NewsProps {
	sources: [
		{
			name: string;
			logo: {
				logoUrl: string;
				width: number;
			};
			latestStories: StoryInfo[];
		}
	];
}

const MAX_STORIES = 8;

const News: React.FunctionComponent<NewsProps> = ({ sources }: NewsProps) => {
	return (
		<div>
			<div className="flex flex-col w-full min-h-screen bg-gray-100">
				<Navbar page={"News"} userStatus={null} />
				<div className="mx-auto max-w-7xl rounded-xl p-4">
					<div className="flex flex-col">
						<h1 className="flex items-center text-3xl font-bold p-6 ml-16">
							Latest News
						</h1>
						{sources.map((source, index) => {
							const {
								logo: { logoUrl, width },
								latestStories
							} = source;
							return (
								<div
									key={index}
									className="flex flex-col mb-20"
								>
									<img
										width={width}
										src={logoUrl}
										className="mb-6"
									/>
									<div className="grid grid-cols-4 gap-6 max-w-6xl">
										{latestStories.map((story, index) => {
											const {
												headline,
												link,
												postTime,
												imageUrl
											} = story;
											return (
												<div
													key={index}
													className="rounded-lg bg-white overflow-hidden shadow-lg"
												>
													<a
														href={link}
														target="_blank"
														rel="noreferrer"
													>
														<img
															width={275}
															src={imageUrl}
														/>
													</a>
													<div className="flex flex-col justify-between">
														<a
															href={link}
															target="_blank"
															rel="noreferrer"
														>
															<p className="text-left font-medium mt-4 mx-4">
																{headline}
															</p>
														</a>
														<p className="text-gray-600 mb-4 mx-4">
															{postTime}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
			<footer className={"footer"}>
				<div className="w-full flex flex-row justify-between bg-gray-400 p-5 mt-10">
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold">Godspeed</h1>
					</div>
				</div>
			</footer>
		</div>
	);
};

const headersConfig = {
	headers: {
		"Content-Type": "application/json",
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
		"sec-fetch-dest": "none",
		accept: "*/*",
		"sec-fetch-site": "cross-site",
		"sec-fetch-mode": "cors",
		"accept-language": "en-US"
	}
};

const fetchSneakerNews = () => {
	return new Promise((resolve, reject) => {
		fetch("https://sneakernews.com/", headersConfig)
			.then((response) => response.text())
			.then((html) => {
				const $ = cheerio.load(html);
				resolve(
					$(".post-ads-container-home")
						.find(".post-box")
						.map((index, elem) => {
							if (index < MAX_STORIES) {
								const imageBox = $(elem).find(".image-box");
								const postContent = $(elem).find(
									".post-content"
								);
								return {
									headline: postContent
										.find("h4")
										.find("a")
										.text()
										.trim(),
									link: postContent
										.find("h4")
										.find("a")
										.attr("href"),
									postTime: `${postContent
										.find("div > span:nth-child(2)")
										.text()} ago`,
									imageUrl: imageBox
										.find("a")
										.find("img")
										.attr("src")
								};
							}
						})
						.get()
				);
			})
			.catch((err) => reject(err));
	});
};

const fetchSoleCollector = () => {
	return new Promise((resolve, reject) => {
		fetch(
			"https://solecollector.com/api/dsl/article?get=42&skip=0&sortBy=published",
			headersConfig
		)
			.then((response) => response.json())
			.then((results) => {
				let storyCount = 0;
				const latestStories = results.reduce(
					(
						latestStories,
						{
							headline,
							alias,
							datePublished,
							thumbnail: {
								transformation: {
									transformations,
									asset: { cloudinaryId, seoFilename }
								}
							}
						}
					) => {
						if (
							storyCount < MAX_STORIES &&
							transformations !== null
						) {
							const { height, width, x, y } = transformations;
							const postDate = new Date(datePublished);
							const time =
								new Date().getUTCHours() -
								1 -
								postDate.getUTCHours();
							const postTime =
								new Date().getDate() !== postDate.getDate()
									? `${
											months[
												(postDate.getMonth() + 1)
													.toString()
													.padStart(2, "0")
											]
									  } ${postDate.getDate()}`
									: `${time} hours ago`;
							storyCount++;
							latestStories.push({
								headline: headline,
								link: `https://solecollector.com/news/${alias}`,
								postTime: postTime,
								imageUrl: `https://images.solecollector.com/complex/images/c_crop,h_${height},w_${width},x_${x},y_${y}/c_fill,dpr_2.0,f_auto,fl_lossy,q_auto,w_800/${cloudinaryId}/${seoFilename}`
							});
						}
						return latestStories;
					},
					[]
				);
				resolve(latestStories);
			})
			.catch((err) => reject(err));
	});
};

export const getStaticProps: GetStaticProps = async () => {
	const SneakerNewsLatestStories = await fetchSneakerNews();
	const SoleCollectorLatestStories = await fetchSoleCollector();

	return {
		props: {
			sources: [
				{
					name: "Sneaker News",
					logo: {
						logoUrl:
							"https://sneakernews.com/wp-content/themes/sneakernews/images/site-logo.png",
						width: 300
					},
					latestStories: SneakerNewsLatestStories
				},
				{
					name: "Sole Collector",
					logo: {
						logoUrl:
							"https://images.solecollector.com/complex/image/upload/v1557174781/SC_Logo_TM_Blue_20190506-01_eeopog.svg",
						width: 250
					},
					latestStories: SoleCollectorLatestStories
				}
			]
		}
	};
};

export default News;
