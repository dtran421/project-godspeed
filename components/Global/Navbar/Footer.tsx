import React, { FC } from "react";

const Footer: FC<Record<string, never>> = () => {
	return (
		<footer>
			<div className="w-full flex flex-row justify-between bg-gray-300 dark:bg-black transition-color duration-150 ease-in-out p-10 mt-10">
				<div className="w-3/4 mx-auto grid grid-cols-2">
					<div>
						<div className="flex mb-12">
							<img
								src="/godspeed.png"
								width={30}
								className="mr-1"
							/>
							<h1 className="text-2xl font-semibold">Godspeed</h1>
						</div>
						<div className="flex gap-x-24">
							<div className="flex flex-col">
								<div className="flex flex-col gap-y-2">
									<h1 className="text-lg text-purple-500 font-semibold">
										Navigation
									</h1>
									<p>News</p>
									<p>Drops</p>
									<p>Dashboard</p>
								</div>
							</div>
							<div className="flex flex-col">
								<div className="flex flex-col gap-y-2">
									<h1 className="text-lg text-purple-500 font-semibold">
										Social Media
									</h1>
									<p>Instagram</p>
									<p>Twitter</p>
									<p>Facebook</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
