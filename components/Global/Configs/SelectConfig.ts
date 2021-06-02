/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const colors = {
	light: {
		controlBg: "#FFFFFF", // control (input)
		controlLabel: "#000000", // control text
		optionLabel: "#000000", // option text
		optionBg: "#FFFFFF", // option background
		optionBgActive: "#8B5CF6", // active option (click),
		optionBgSelected: "#8B5CF6",
		optionBgFocused: "#A78BFA", // hover option
		multiLabel: "#7C3AED", // selected label text
		multiBg: "#EDE9FE", // selected label bg
		multiRemove: "#8B5CF6", // X symbol
		multiRemoveHover: "#FFFFFF", // hover X symbol
		multiRemoveHoverBg: "#6D28D9" // hover X bg
	},
	dark: {
		controlBg: "#111827", // control (input)
		controlLabel: "#FFFFFF", // control text
		optionLabel: "#FFFFFF", // option text
		optionBg: "#111827", // option background
		optionBgActive: "#7C3AED", // active option (click),
		optionBgSelected: "#7C3AED",
		optionBgFocused: "#A78BFA", // hover option
		multiLabel: "#FFFFFF", // selected label text
		multiBg: "#7C3AED", // selected label bg
		multiRemove: "#FFFFFF", // X symbol
		multiRemoveHover: "#5B21B6", // hover X symbol
		multiRemoveHoverBg: "#A78BFA" // hover X bg
	}
};

export const selectStyles = (theme: string) => {
	const colorScheme = theme === "dark" ? colors.dark : colors.light;
	return {
		control: (styles) => ({
			...styles,
			backgroundColor: colorScheme.controlBg
		}),
		menu: (styles) => ({
			...styles,
			backgroundColor: colorScheme.optionBg
		}),
		option: (styles, { isFocused, isSelected }) => {
			return {
				...styles,
				backgroundColor: isSelected
					? colorScheme.optionBgSelected
					: isFocused
					? colorScheme.optionBgFocused
					: colorScheme.optionBg,
				color: colorScheme.optionLabel,
				cursor: "default",
				":active": {
					...styles[":active"],
					backgroundColor: colorScheme.optionBgActive
				}
			};
		},
		singleValue: (styles) => {
			return {
				...styles,
				color: colorScheme.controlLabel
			};
		},
		multiValue: (styles) => {
			return {
				...styles,
				backgroundColor: colorScheme.multiBg
			};
		},
		multiValueLabel: (styles) => ({
			...styles,
			color: colorScheme.multiLabel
		}),
		multiValueRemove: (styles) => ({
			...styles,
			color: colorScheme.multiRemove,
			":hover": {
				backgroundColor: colorScheme.multiRemoveHoverBg,
				color: colorScheme.multiRemoveHover
			}
		})
	};
};

export default selectStyles;
