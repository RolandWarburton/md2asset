import fs from "node:fs";
import path from "node:path";
import em from "./util/hookEmitter.js";
import { Content, Image, Parent } from "mdast";
import downloadImage from "./downloadImage.js";
import stringIsAValidUrl from "./util/validateUrl.js";
import debug from "debug";
export const log = debug("md2asset");

// the takes the current node and traverses all of its children
export function traverseNextNodes(node: Parent, mdFile: path.ParsedPath, storedImages: any): void {
	// if there are children on this node, then we need to traverse them as well (recursively)
	if (node.children) {
		node.children.forEach((child: any) => {
			traverseNodes(child, mdFile, storedImages);
		});
	}
}

/**
 *
 * @param childArg - The node to traverse
 * @param mdFile - The path to the markdown file
 * @param storedImages - The images that have been stored so far
 */
function traverseNodes(childArg: Parent, mdFile: path.ParsedPath, storedImages: any): void {
	// check this node is an image
	if (childArg.type !== "image") {
		log(`skipping non image node`);
		traverseNextNodes(childArg, mdFile, storedImages);
		return;
	}

	// validate the image URL as an external one (not already pointing to a file)
	const child = childArg as Content as Image;
	if (!stringIsAValidUrl(child.url)) {
		log(`skipping ${child.url}`);
		traverseNextNodes(childArg, mdFile, storedImages);
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
		mdFile.dir,
		"assets",
		mdFile.name,
		`${altText.trim().replace(/ /gi, `-`)}-${storedImages[altText]}${ext}`
	);

	// we passed the syntax tree by reference so we can directly edit the tree here and access it later
	child.url = path.relative(mdFile.dir, newfp);

	// create a sub folder for this file in the assets directory
	if (!fs.existsSync(path.parse(newfp).dir)) {
		const p = path.join(path.parse(newfp).dir);
		fs.mkdirSync(p);
	}

	// download the image to the assets/[file]/file.md
	// (will write to disk at this point asynchronously and continue on)
	downloadImage(url.toString(), newfp).then((_) => em.emit("downloadImage", url.toString()));

	// if there are children on this node, then we need to traverseNodes them as well (recursively)
	if (childArg.children) {
		childArg.children.forEach((child: any) => {
			traverseNodes(child, mdFile, {});
		});
	}
}

export default traverseNodes;
