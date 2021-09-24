// A small wrapper for bin/index.js to call the CLI.
// The purpose for this to exist is to provide some filtering of CLI arguments

import app from "./app.js";
import debug from "debug";
const log = debug("md2asset");

import fs from "fs";

function printHelp() {
	console.log(`MD2Asset: version 1.2.3`);
	console.log("Usage:\t\tmd2asset [FILE]");
}

function cli(args: string[]) {
	log(args);

	// check for at least one argument
	if (process.argv.length < 3) {
		console.log("Incorrect number of arguments. Use --help for more information.");
		process.exit(1);
	}

	// print command help
	if (process.argv[2] === "--help") {
		printHelp();
		process.exit(0);
	}

	// check each file passed in is a file
	process.argv[2]?.split(" ").forEach((file) => {
		try {
			if (!fs.existsSync(file)) {
				console.log(`File ${file} does not exist`);
				process.exit(1);
			}
		} catch (err) {
			console.log(err);
			process.exit(1);
		}
	});

	// call the app with safe arguments
	return app(args);
}

export default cli;
