// eslint-disable-next-line no-undef
module.exports = {
	purge: [],
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
