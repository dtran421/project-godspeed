import Link from "next/link";
import React, { FC } from "react";

const Footer: FC<Record<string, never>> = () => {
	return (
		<footer>
			<div className="w-full flex flex-row justify-between bg-gray-300 dark:bg-black transition-color duration-150 ease-in-out p-6 lg:p-10 mt-10">
				<div className="w-full lg:w-3/4 mx-auto grid grid-cols-2">
					<div className="col-span-2 lg:col-span-1 flex mb-4 lg:mb-12">
						<img src="/godspeed.png" width={30} className="mr-1" />
						<h1 className="text-xl md:text-2xl font-semibold">
							Godspeed
						</h1>
					</div>
					<div className="hidden lg:col-span-1 lg:flex" />
					<div className="flex gap-x-24">
						<div className="flex flex-col gap-y-2">
							<h1 className="lg:text-lg text-purple-500 font-semibold">
								Navigation
							</h1>
							<FooterLink
								type={"internal"}
								text={"News"}
								link="/news"
							/>
							<FooterLink
								type={"internal"}
								text={"Drops"}
								link="/drops"
							/>
							<FooterLink
								type={"internal"}
								text={"Dashboard"}
								link="/dashboard"
							/>
						</div>
						<div className="hidden lg:flex flex-col gap-y-2">
							<h1 className="lg:text-lg text-purple-500 font-semibold">
								Social Media
							</h1>
							<FooterLink
								type={"external"}
								text={"Instagram"}
								link=""
							/>
							<FooterLink
								type={"external"}
								text={"Twitter"}
								link=""
							/>
							<FooterLink
								type={"external"}
								text={"Facebook"}
								link=""
							/>
						</div>
					</div>
					<div className="flex flex-col lg:hidden">
						<div className="flex flex-col gap-y-2">
							<h1 className="lg:text-lg text-purple-500 font-semibold">
								Social Media
							</h1>
							<FooterLink
								type={"external"}
								text={"Instagram"}
								link=""
							/>
							<FooterLink
								type={"external"}
								text={"Twitter"}
								link=""
							/>
							<FooterLink
								type={"external"}
								text={"Facebook"}
								link=""
							/>
						</div>
					</div>
					<div className="col-span-2 lg:col-span-1 flex flex-col items-center mt-6 lg:mt-0">
						<h1 className="lg:text-lg text-purple-500 font-semibold mb-4">
							Powered by
						</h1>
						<div className="grid grid-cols-4 lg:flex gap-x-4 lg:gap-x-8">
							<a
								href="https://stockx.com"
								target="_blank"
								rel="noreferrer"
							>
								<img
									src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco/hvhqzscb7we0hifjqr2q"
									width={75}
									className="rounded-xl overflow-hidden"
								/>
							</a>
							<a
								href="https://sneakernews.com"
								target="_blank"
								rel="noreferrer"
							>
								<img
									src="https://media-exp1.licdn.com/dms/image/C4D0BAQEoywCJShMUTw/company-logo_200_200/0/1526675030953?e=2159024400&v=beta&t=alCoaFZz3G_IuzetR5Fev2w-AadyyuK9_UFIwA0OE5s"
									width={75}
									className="rounded-xl overflow-hidden"
								/>
							</a>
							<a
								href="https://solecollector.com"
								target="_blank"
								rel="noreferrer"
							>
								<img
									src="https://images.solecollector.com/complex/image/upload/f_auto,fl_lossy,q_auto,w_1200/SC_Logo_Globe_TM_Blue_20190506-01-01-01_urcggx.png"
									width={75}
									className="bg-white rounded-xl overflow-hidden p-2"
								/>
							</a>
							<a
								href="https://complex.com/sneakers"
								target="_blank"
								rel="noreferrer"
							>
								<img
									src="https://images.complex.com/image/upload/w_650/complex_nbiphu.jpg"
									width={75}
									className="rounded-xl overflow-hidden"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

interface FooterLinkProps {
	type: string;
	text: string;
	link: string;
}

const FooterLink: FC<FooterLinkProps> = ({
	type,
	text,
	link
}: FooterLinkProps) => {
	return type === "internal" ? (
		<Link href={link}>
			<p className="text-sm md:text-md cursor-pointer">{text}</p>
		</Link>
	) : (
		<a href={link} target="_blank" rel="noreferrer">
			<p className="text-sm md:text-md cursor-pointer">{text}</p>
		</a>
	);
};

export default Footer;
