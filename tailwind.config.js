// eslint-disable-next-line no-undef
module.exports = {
	mode: "jit",
	purge: [
		"./public/**/*.html",
		"./pages/**/*.{js,jsx,ts,tsx,vue}",
		"./components/**/*.{js,jsx,ts,tsx,vue}"
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {}
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
