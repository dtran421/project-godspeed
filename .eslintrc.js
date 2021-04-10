module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	ignorePatterns: [
		".eslintrc.js",
		"_app.js",
		"postcss.config.js",
		"next.config.js",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint"],
	rules: {
		indent: ["error", "tab"],
		quotes: ["error", "double"],
		semi: ["warn", "always"],
	},
};
