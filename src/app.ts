import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import { Content, Image, Parent } from "mdast";
import downloadImage from "./downloadImage.js";
import stringIsAValidUrl from "./util/validateUrl.js";
import em from "./util/hookEmitter.js";

function app(args: string[]) {
	// register an emitter to listen for the downloadImage event
	em.on("downloadImage", (url: string) => {
		console.log(`downloaded ${url}`);
	});

	// if (process.argv[2] === undefined) {
	if (args[2] === undefined) {
		console.log("please pass in a file name");
		process.exit(1);
	}

	// take the filepath as an argument
	const imgfp = args[2];

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
				path.parse(imgfp).name,
				altText.trim() + "_" + storedImages[altText] + ext
			);

			// we passed the syntax tree by reference so we can directly edit the tree here and access it later
			child.url = path.relative(path.parse(imgfp).dir, newfp);

			// create a sub folder for this file in the assets directory
			if (!fs.existsSync(path.parse(newfp).dir)) {
				const p = path.join(path.parse(newfp).dir);
				fs.mkdirSync(p);
			}

			// download the image to the assets/[file]/file.md
			// (will write to disk at this point asynchronously and continue on)
			downloadImage(url.toString(), newfp).then((_) =>
				em.emit("downloadImage", url.toString())
			);
		}

		// if there are children on this node, then we need to traverse them as well (recursively)
		if (childArg.children) {
			childArg.children.forEach((child: any) => {
				traverse(child, fp);
			});
		}
	}

	traverse(syntaxTree, path.resolve(imgfp, "assets"));

	// render out the new markdown, the altered image urls are contained in this syntax tree
	const newContent = remark().stringify(syntaxTree);

	if (process.env["NO_WRITE"] === "true") {
		console.log(newContent);
	} else {
		// we must be in production so we can write the file to disk
		fs.writeFileSync(imgfp, newContent);
	}
}

export default app;
