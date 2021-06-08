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
			inset: {
				17: "4.30rem",
				18: "4.40rem",
				19: "4.50rem"
			},
			minHeight: {
				25: "25rem"
			},
			width: {
				22: "5.5rem"
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
