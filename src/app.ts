import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import downloadImage from "./downloadImage.js";
import traverseNodes from "./traverseNodes.js";
import em from "./util/hookEmitter.js";

// register an emitter to listen for the downloadImage event
em.on("downloadImage", ({ url, filePath }: { url: string; filePath: string }) => {
	// download the image to the assets/[file]/file.md
	downloadImage(url.toString(), filePath).then(() => console.log(`downloaded ${url}`));
});

function app(args: string[]): void {
	// take the filepath as an argument
	const mdFile = path.parse(args[2] as string);

	// load the markdownFile
	const markdownFile = fs.readFileSync(path.format(mdFile), "utf-8");

	// https://github.com/remarkjs/remark and docs at https://github.com/remarkjs/remark/tree/main/packages/remark
	// remark is a markdown processor thats part of a collection of markdown tools
	//
	// remark parses the markdown into a syntax tree using remark-parse
	// after parsing, we are left with a json object that represents the syntax tree of the markdown file
	const syntaxTree = remark().parse(markdownFile);

	// stores a map of the images alt text, and how many times the alt text was seen previously for naming purposes
	// EG:
	// { image_01: 1, image_02: 3 }
	// the above JSON means that we have seen an image with the alt text[image_01] once and[image_02] three times
	const storedImages: any = {};

	// get the directory of the markdown file that we are converting
	const markdownFileBaseDir = path.resolve(mdFile.dir);

	// create an assets folder inside the direcotry of the markdown file
	if (!fs.existsSync(path.resolve(markdownFileBaseDir, "assets"))) {
		const p = path.join(path.resolve(markdownFileBaseDir, "assets"));
		fs.mkdirSync(p);
	}

	traverseNodes(syntaxTree, mdFile, storedImages as any);

	// render out the new markdown, the altered image urls are contained in this syntax tree
	const newContent = remark().stringify(syntaxTree);

	if (process.env["NO_WRITE"] === "true") {
		console.log(newContent);
	} else {
		// we must be in production so we can write the file to disk
		fs.writeFileSync(path.format(mdFile), newContent);
	}
}

export default app;
