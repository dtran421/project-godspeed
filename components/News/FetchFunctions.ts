import cheerio from "cheerio";

import { headersConfig } from "../../pages/_app";
import { months } from "../../pages/drops";

const MAX_STORIES = 8;

export const fetchSneakerNewsPopular = (): Promise<unknown> => {
	return new Promise((resolve, reject) => {
		fetch("https://sneakernews.com/", headersConfig)
			.then((response) => response.text())
			.then((html) => {
				const $ = cheerio.load(html);
				const newHomeSidebar = $(".new-home-sidebar");
				const popularStory1 = newHomeSidebar.find("ul > li");
				const popularStories = [
					{
						headline: popularStory1
							.find(".slider-text > h2 > a")
							.text()
							.trim(),
						link: popularStory1.find("a").attr("href"),
						imageUrl: popularStory1.find("a > img").attr("src")
					}
				];
				newHomeSidebar
					.find(".side-post-cnt")
					.each((index, sidePostContainer) => {
						popularStories.push({
							headline: $(sidePostContainer)
								.find("span")
								.text()
								.trim(),
							link: $(sidePostContainer).find("a").attr("href"),
							imageUrl: $(sidePostContainer)
								.find("a > img")
								.attr("src")
						});
					});
				resolve(popularStories);
			})
			.catch((err) => reject(err));
	});
};

export const fetchSoleCollectorPopular = (): Promise<unknown> => {
	return new Promise((resolve, reject) => {
		fetch("https://solecollector.com/", headersConfig)
			.then((response) => response.text())
			.then((html) => {
				const $ = cheerio.load(html);
				const heroContainer = $(".home-hero__container");
				const popularStory1Title = heroContainer.find(
					".product-overlay"
				);
				const popularStory1Image = heroContainer.find(
					".viewport-image > a"
				);
				const popularStories = [
					{
						headline: popularStory1Title
							.find("div > div > div > a > h2")
							.text()
							.trim(),
						link: `https://solecollector.com${popularStory1Image.attr(
							"href"
						)}`,
						imageUrl: popularStory1Image.find("img").attr("src")
					}
				];
				$(".clg-news__container")
					.find(".clg-news__item")
					.each((index, clgNewsItem) => {
						if (index < 2) {
							const imgATag = $(clgNewsItem)
								.find("div > a")
								.first();
							popularStories.push({
								headline: $(clgNewsItem)
									.find("h2")
									.text()
									.trim(),
								link: `https://solecollector.com${imgATag.attr(
									"href"
								)}`,
								imageUrl: imgATag.find("img").attr("src")
							});
						}
					});
				resolve(popularStories);
			})
			.catch((err) => reject(err));
	});
};

export const fetchComplexSneakersPopular = (): Promise<unknown> => {
	return new Promise((resolve, reject) => {
		fetch("https://www.complex.com/sneakers/", headersConfig)
			.then((response) => response.text())
			.then((html) => {
				const $ = cheerio.load(html);
				const glideSlides = $(".glide__slide");
				const popularStories = glideSlides
					.map((index, elem) => {
						const topStory = $(elem).find("a").first();
						return {
							headline: topStory.attr("title").trim(),
							link: topStory.attr("href"),
							imageUrl: topStory.find("img").attr("src")
						};
					})
					.get();
				console.log(popularStories);
				resolve(popularStories);
			})
			.catch((err) => reject(err));
	});
};

export const fetchSneakerNews = (): Promise<unknown> => {
	return new Promise((resolve, reject) => {
		fetch("https://sneakernews.com/", headersConfig)
			.then((response) => response.text())
			.then((html) => {
				const $ = cheerio.load(html);
				const latestStories = $(".post-ads-container-home")
					.find(".post-box")
					.map((index, elem) => {
						if (index < MAX_STORIES) {
							const imageBox = $(elem).find(".image-box");
							const postContent = $(elem).find(".post-content");
							return {
								headline: postContent
									.find("h4 > a")
									.text()
									.trim(),
								link: postContent.find("h4 > a").attr("href"),
								postTime: `${postContent
									.find("div > span:nth-child(2)")
									.text()} ago`,
								imageUrl: imageBox.find("a > img").attr("src")
							};
						}
					})
					.get();
				resolve(latestStories);
			})
			.catch((err) => reject(err));
	});
};

export const fetchSoleCollector = (): Promise<Record<string, string>[]> => {
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
							const {
								height = 183,
								width = 325,
								x,
								y
							} = transformations;
							const currDate = new Date();
							const postDate = new Date(datePublished);
							const time = Math.floor(
								(currDate.getTime() - postDate.getTime()) / 36e5
							);
							const postTime =
								currDate.getDate() !== postDate.getDate()
									? `${
											months[
												(postDate.getMonth() + 1)
													.toString()
													.padStart(2, "0")
											]
									  } ${postDate.getDate()}`
									: `${time} hours ago`;
							const imageUrl =
								x && y
									? `https://images.solecollector.com/complex/images/c_crop,h_${height},w_${width},x_${x},y_${y}/c_fill,dpr_2.0,f_auto,fl_lossy,q_auto,w_800/${cloudinaryId}/${seoFilename}`
									: `https://images.solecollector.com/complex/images/c_fill,dpr_2.0,h_${height},q_70,w_${width}/${cloudinaryId}/${seoFilename}`;
							storyCount++;
							latestStories.push({
								headline: headline,
								link: `https://solecollector.com/news/${alias}`,
								postTime: postTime,
								imageUrl: imageUrl
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

export const fetchComplexSneakers = (): Promise<Record<string, string>[]> => {
	return new Promise((resolve, reject) => {
		fetch(
			"https://www.complex.com/api/channel/6/articles?take=20",
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
							thumbnail: { transformation }
						}
					) => {
						if (storyCount < MAX_STORIES) {
							const currDate = new Date();
							const postDate = new Date(datePublished);
							const time = Math.floor(
								(currDate.getTime() - postDate.getTime()) / 36e5
							);
							const postTime =
								currDate.getDate() !== postDate.getDate()
									? `${
											months[
												(postDate.getMonth() + 1)
													.toString()
													.padStart(2, "0")
											]
									  } ${postDate.getDate()}`
									: time === 1
									? `${time} hour ago`
									: `${time} hours ago`;

							if (transformation.transformations) {
								const {
									transformations: {
										height,
										width,
										x,
										y,
										crop
									},
									asset: { cloudinaryId, seoFilename }
								} = transformation;
								latestStories.push({
									headline: headline,
									link: `https://www.complex.com/sneakers/${alias}`,
									postTime: postTime,
									imageUrl: `https://images.complex.com/complex/images/${
										crop
											? `c_crop,h_${height},w_${width},x_${x},y_${y}/`
											: ""
									}c_fill,dpr_auto,f_auto,g_face,h_183,q_auto,w_325/fl_lossy,pg_1/${cloudinaryId}/${seoFilename}?fimg-client-default`
								});
							} else {
								const {
									asset: { cloudinaryId, seoFilename }
								} = transformation;
								latestStories.push({
									headline: headline,
									link: `https://www.complex.com/sneakers/${alias}`,
									postTime: postTime,
									imageUrl: `https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,g_face,h_183,q_auto,w_325/fl_lossy,pg_1/${cloudinaryId}/${seoFilename}?fimg-client-default`
								});
							}

							storyCount++;
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
