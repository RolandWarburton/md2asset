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
	moduleFileExtensions: ["js", "ts", "tsx"],
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
			useESM: true,
		},
	},
	moduleNameMapper: {
		"^(.*)\\.js$": "$1",
	},
	extensionsToTreatAsEsm: [".ts"],
	preset: "ts-jest",
	testPathIgnorePatterns: ["<rootDir>/dist"],
	testMatch: ["**/__tests__/*.+(ts|tsx|js)"],
};

export default config;
