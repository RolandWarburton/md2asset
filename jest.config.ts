import type { Config } from "@jest/types";

// =================================================================================================
// See this issue (and the comment below it) for why we need all these weird options
// https://github.com/facebook/jest/issues/11453#issuecomment-877490572

const config: Config.InitialOptions = {
	moduleFileExtensions: ["ts", "tsx", "js"],
	testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
	moduleNameMapper: {
		"^(.*)\\.js$": "$1",
	},
	testEnvironment: "jest-environment-node",
	transformIgnorePatterns: [
		"node_modules/(?!aggregate-error|clean-stack|escape-string-regexp|indent-string|p-map)",
	],
};

export default config;
