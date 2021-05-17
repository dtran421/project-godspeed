/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const colors = {
	optionLabel: "#000000", // option text
	optionBgActive: "#C4B5FD", // active option (click),
	optionBgSelected: "#C4B5FD",
	optionBgFocused: "#DDD6FE", // hover option
	multiLabel: "#7C3AED", // selected label text
	multiBg: "#EDE9FE", // selected label bg
	multiRemove: "#8B5CF6", // X symbole
	multiRemoveHoverBg: "#6D28D9" // hover X bg
};

export default {
	control: (styles) => ({ ...styles, backgroundColor: "white" }),
	option: (styles, { isFocused, isSelected }) => {
		return {
			...styles,
			backgroundColor: isSelected
				? colors.optionBgSelected
				: isFocused && colors.optionBgFocused,
			color: colors.optionLabel,
			cursor: "default",
			":active": {
				...styles[":active"],
				backgroundColor: colors.optionBgActive
			}
		};
	},
	multiValue: (styles) => {
		return {
			...styles,
			backgroundColor: colors.multiBg
		};
	},
	multiValueLabel: (styles) => ({
		...styles,
		color: colors.multiLabel
	}),
	multiValueRemove: (styles) => ({
		...styles,
		color: colors.multiRemove,
		":hover": {
			backgroundColor: colors.multiRemoveHoverBg,
			color: "white"
		}
	})
};
