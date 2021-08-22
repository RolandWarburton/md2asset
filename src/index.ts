//
// Markdown url to local asset generator
// Author: https://github.com/RolandWarburton
//
// Notes:
// Currently for development using ts-node, imports need to have a .js extension
// see https://github.com/TypeStrong/ts-node/issues/1007

import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import { Content, Image, Parent } from "mdast";
import downloadImage from "./downloadImage.js";
import em from "./util/hookEmitter.js";

// register an emitter to listen for the downloadImage event
em.on("downloadImage", (url: string) => {
	console.log(`downloaded ${url}`);
});

// Using { type: "module" } in package.json removes the __dirname from the envrionent
// Using path.resolve() without an argument resolves to $PWD
// allowing us to resolve paths relative to wherever the script was called
// const __dirname = path.resolve();

if (process.argv[2] === undefined) {
	console.log("please pass in a file name");
	process.exit(1);
}

// TODO take the filepath as an argument
// const imgfp = path.resolve(__dirname, "src", "test.md");
const imgfp = process.argv[2];

// load the markdownFile
const markdownFile = fs.readFileSync(imgfp, "utf-8");

// https://github.com/remarkjs/remark and docs at https://github.com/remarkjs/remark/tree/main/packages/remark
// remark is a markdown processor thats part of a collection of markdown tools
//
// remark parses the markdown into a syntax tree using remark-parse
// after parsing, we are left with a json object that represents the syntax tree of the markdown file
const syntaxTree = remark().parse(markdownFile);
syntaxTree.children;

// stores a map of the images alt text, and how many times the alt text was seen previously for naming purposes
// EG:
// { image_01: 1, image_02: 3 }
// the above JSON means that we have seen an image with the alt text[image_01] once and[image_02] three times
const storedImages: any = {};

// get the directory of the markdown file that we are converting
const markdownFileBaseDir = path.parse(imgfp).dir;

// create an assets folder inside the direcotry of the markdown file
if (!fs.existsSync(path.resolve(markdownFileBaseDir, "assets"))) {
	const p = path.join(path.resolve(markdownFileBaseDir, "assets"));
	fs.mkdirSync(p);
}

const stringIsAValidUrl = (s: string): boolean => {
	try {
		new URL(s);
		return true;
	} catch (err) {
		return false;
	}
};

function traverse(childArg: Parent, fp: string) {
	if (childArg.type === "image") {
		const child = childArg as Content as Image;

		// validate the images URL as an external one (not already pointing to a file)
		if (!stringIsAValidUrl(child.url)) {
			return;
		}

		// validate that the child has an alt text. If not give it a default one.
		if (child.alt === "") {
			child.alt = "unnamed";
		}

		// now that we know the alt is (likely) a string we can cast it to a string
		const altText: string = child.alt as string;

		// get the url bits to manipulate
		const url = new URL(child.url);

		// get the extension of the image that we are downloading
		const ext = path.extname(url.pathname);

		// create a new file path placeholder that will be overwritten later
		let newfp = "assets/placeholder";

		// the purpose of this block is to count the number of times the alt text has been seen
		// if the alt text exists as a key inside the storedImages object, we increment the value
		// the value is then and appended to the end of the new file path
		if (storedImages[altText] === undefined) {
			// if the alt text has not been seen before, we create a new key in the storedImages object
			// the default value is 1 because we have seen it once
			storedImages[altText] = 1;
		} else {
			// get the current number of stored images with this name and increment it
			const newIndex = parseInt(storedImages[altText] || "1") + 1;

			// store this new value in the storedImages object
			storedImages[altText] = newIndex;
		}

		// set the url for the new file path to `{altText}_{number}`
		newfp = path.resolve(
			path.parse(imgfp).dir,
			"assets",
			altText.trim() + "_" + storedImages[altText] + ext
		);

		// we passed the syntax tree by reference so we can directly edit the tree here and access it later
		child.url = path.relative(path.parse(imgfp).dir, newfp);

		// download the image (will write to disk at this point asyncronously and continue on)
		downloadImage(url.toString(), newfp).then((_) => em.emit("downloadImage", url.toString()));
	}

	// if there are children on this node, then we need to traverse them as well (recursively)
	if (childArg.children) {
		childArg.children.forEach((child: any) => {
			traverse(child, fp);
		});
	}
}

traverse(syntaxTree, path.resolve(imgfp, "assets"));
// const newContent = remark().stringify(syntaxTree);
// fs.writeFileSync(imgfp, newContent);

console.log(syntaxTree);
