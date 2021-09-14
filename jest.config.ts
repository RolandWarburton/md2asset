import type { Config } from "@jest/types";
// import jest from "ts-jest";

// =================================================================================================
// See this issue (and the comment below it) for why we need all these weird options
// https://github.com/facebook/jest/issues/11453#issuecomment-877490572
//
// You need to run this with experimental-vm-modules as per https://jestjs.io/docs/ecmascript-modules
// node --experimental-vm-modules node_modules/jest/bin/jest.js --config=jest.config.ts
// you can also use this command to make life easier
// NODE_OPTIONS=--experimental-vm-modules jest --config=jest.config.ts

const config: Config.InitialOptions = {
	testEnvironment: "node",
	// tell jest to use these file extensions only
	moduleFileExtensions: ["js", "ts", "tsx"],
	// run tests that end with .ts or .js and pass them through ts-jest to transpile them
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	globals: {
		"ts-jest": {
			// tell ts-jest what compiler settings to use
			tsconfig: "tsconfig.json",
			// support ESM https://kulshekhar.github.io/ts-jest/docs/next/guides/esm-support/
			useESM: true,
		},
	},
	// remap the names of imports to remove the .js extension
	moduleNameMapper: {
		"^(.*)\\.js$": "$1",
	},
	// treat .ts as ESM so you can use import/export instead of require/module.exports
	extensionsToTreatAsEsm: [".ts"],
	// a base config for jest to use
	preset: "ts-jest",
	// ignore dist folder. Do not look for tests here
	testPathIgnorePatterns: ["<rootDir>/dist"],
	// run any tests in the __tests__ directory
	testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
};

export default config;
