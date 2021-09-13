// A small wrapper for bin/index.js to call the CLI.

import app from "./app.js";

function cli(args: string[]) {
	return app(args);
}

export default cli;
