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
				23: "23rem"
			},
			inset: {
				18: "4.25rem"
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
