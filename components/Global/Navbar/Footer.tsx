import React, { FC } from "react";

const Footer: FC<Record<string, never>> = () => {
	return (
		<footer>
			<div className="w-full flex flex-row justify-between bg-gray-300 dark:bg-black transition-color duration-150 ease-in-out p-10 mt-10">
				<div className="w-3/4 mx-auto grid grid-cols-2">
					<div className="flex mb-12">
						<img src="/godspeed.png" width={30} className="mr-1" />
						<h1 className="text-2xl font-semibold">Godspeed</h1>
					</div>
					<div />
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
					<div className="flex flex-col items-center">
						<h1 className="text-lg text-purple-500 font-semibold mb-4">
							Powered by
						</h1>
						<div className="flex gap-x-8">
							<a href="https://stockx.com">
								<img
									src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco/hvhqzscb7we0hifjqr2q"
									width={75}
									className="rounded-xl overflow-hidden"
								/>
							</a>
							<img
								src="https://media-exp1.licdn.com/dms/image/C4D0BAQEoywCJShMUTw/company-logo_200_200/0/1526675030953?e=2159024400&v=beta&t=alCoaFZz3G_IuzetR5Fev2w-AadyyuK9_UFIwA0OE5s"
								width={75}
								className="rounded-xl overflow-hidden"
							/>
							<img
								src="https://images.solecollector.com/complex/image/upload/f_auto,fl_lossy,q_auto,w_1200/SC_Logo_Globe_TM_Blue_20190506-01-01-01_urcggx.png"
								width={75}
								className="bg-white rounded-xl overflow-hidden p-2"
							/>
							<img
								src="https://images.complex.com/image/upload/w_650/complex_nbiphu.jpg"
								width={75}
								className="rounded-xl overflow-hidden"
							/>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
