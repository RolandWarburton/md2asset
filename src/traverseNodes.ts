import fs from "node:fs";
import path from "node:path";
import em from "./util/hookEmitter.js";
import { Content, Image } from "mdast";
import stringIsAValidUrl from "./util/validateUrl.js";
import debug from "debug";
import { traverseNextNodes } from "./traverseNextNodes.js";
import { TraverseNodesParams } from "./interfaces/TraverseNodesParams";
export const log = debug("md2asset");

/**
 *
 * @param node - The node to traverse
 * @param mdFile - The path to the markdown file
 * @param storedImages - The images that have been stored so far
 * @param cb - Callback that is provided with the same params as traverseNodes. Importantly,
 * the callback is given the current node so that it can traverse the next node down the tree.
 */
export function traverseNodes({ node, mdFile, storedImages, cb }: TraverseNodesParams): void {
	// check this node is an image
	if (node.type !== "image") {
		log(`skipping non image node (${node.type})`);
		cb({ node, mdFile, storedImages, cb: traverseNextNodes });
		return;
	}

	// validate the image URL as an external one (not already pointing to a file)
	const child = node as Content as Image;
	if (!stringIsAValidUrl(child.url)) {
		log(`skipping ${child.url}`);
		cb({ node, mdFile, storedImages, cb: traverseNextNodes });
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

	// emit a message that this image is ready to be handled
	em.emit("downloadImage", { url: url.toString(), filePath: newfp });

	// if there are children on this node, then we need to traverseNodes them as well (recursively)
	cb({ node, mdFile, storedImages, cb: traverseNextNodes });
}

export default traverseNodes;
