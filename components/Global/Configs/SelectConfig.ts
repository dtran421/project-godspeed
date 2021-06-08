/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const colors = {
	light: {
		controlBg: "#FFFFFF", // control (input)
		controlLabel: "#000000", // control text
		inputText: "#000000",
		menuBorder: "#D1D5DB",
		multiLabel: "#7C3AED", // selected label text
		multiBg: "#EDE9FE", // selected label bg
		multiRemove: "#8B5CF6", // X symbol
		multiRemoveHover: "#FFFFFF", // hover X symbol
		multiRemoveHoverBg: "#6D28D9", // hover X bg
		optionLabel: "#000000", // option text
		optionBg: "#FFFFFF", // option background
		optionBgActive: "#8B5CF6", // active option (click),
		optionBgSelected: "#8B5CF6",
		optionBgFocused: "#A78BFA", // hover option
		placeholderColor: "#374151"
	},
	dark: {
		controlBg: "#111827", // control (input)
		controlLabel: "#FFFFFF", // control text
		inputText: "#FFFFFF",
		menuBorder: "#374151",
		multiLabel: "#FFFFFF", // selected label text
		multiBg: "#7C3AED", // selected label bg
		multiRemove: "#FFFFFF", // X symbol
		multiRemoveHover: "#5B21B6", // hover X symbol
		multiRemoveHoverBg: "#A78BFA", // hover X bg
		optionLabel: "#FFFFFF", // option text
		optionBg: "#111827", // option background
		optionBgActive: "#7C3AED", // active option (click),
		optionBgSelected: "#7C3AED",
		optionBgFocused: "#A78BFA", // hover option
		placeholderColor: "#D1D5DB"
	}
};

export const selectStyles = (theme: string) => {
	const colorScheme = theme === "dark" ? colors.dark : colors.light;
	return {
		control: (styles) => ({
			...styles,
			backgroundColor: colorScheme.controlBg
		}),
		input: (styles) => ({
			...styles,
			color: colorScheme.inputText
		}),
		menu: (styles) => ({
			...styles,
			backgroundColor: colorScheme.optionBg
		}),
		menuList: (styles) => ({
			...styles,
			borderColor: colorScheme.menuBorder
		}),
		option: (styles, { isFocused, isSelected }) => ({
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
		}),
		placeholder: (styles) => ({
			...styles,
			color: colorScheme.placeholderColor
		}),
		singleValue: (styles) => ({
			...styles,
			color: colorScheme.controlLabel
		}),
		multiValue: (styles) => ({
			...styles,
			backgroundColor: colorScheme.multiBg
		}),
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
