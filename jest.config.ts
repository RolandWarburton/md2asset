import type { Config } from "@jest/types";

// =================================================================================================
// See this issue (and the comment below it) for why we need all these weird options
// https://github.com/facebook/jest/issues/11453#issuecomment-877490572
//
// You need to run this with experimental-vm-modules as per https://jestjs.io/docs/ecmascript-modules
// node --experimental-vm-modules node_modules/jest/bin/jest.js --config=jest.config.ts
// you can also use this command to make life easier
// NODE_OPTIONS=--experimental-vm-modules jest --config=jest.config.ts

const config: Config.InitialOptions = {
	moduleFileExtensions: ["ts", "tsx", "js"],
	testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
	moduleNameMapper: {
		"^(.*)\\.js$": "$1",
	},
	// this is set because its mentioned here: https://jestjs.io/docs/ecmascript-modules
	extensionsToTreatAsEsm: [".ts"],
	testEnvironment: "jest-environment-node",
	transformIgnorePatterns: [
		"node_modules/(?!aggregate-error|clean-stack|escape-string-regexp|indent-string|p-map)",
	],
};

export default config;
