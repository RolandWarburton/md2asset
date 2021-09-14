/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	globals: {
		"ts-jest": {
			useESM: true,
		},
	},
	testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
	moduleFileExtensions: ["ts", "tsx", "js"],
};
