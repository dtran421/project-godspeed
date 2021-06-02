// eslint-disable-next-line no-undef
module.exports = {
	mode: "jit",
	purge: [
		"./public/**/*.html",
		"./pages/**/*.{js,jsx,ts,tsx,vue}",
		"./components/**/*.{js,jsx,ts,tsx,vue}"
	],
	darkMode: "class", // or 'media' or 'class'
	theme: {
		extend: {
			minHeight: {
				25: "25rem"
			},
			inset: {
				18: "4.50rem",
				19: "4.40rem"
			}
		}
	},
	variants: {
		extend: {
			backgroundColor: ["active"],
			ringWidth: ["focus"],
			ringColor: ["focus"],
			outline: ["focus"],
			opacity: ["disabled"],
			cursor: ["hover", "disabled"]
		}
	},
	plugins: []
};
