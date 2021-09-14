import path from "node:path";
import { Parent } from "mdast";

export interface TraverseNodesParams {
	node: Parent;
	mdFile: path.ParsedPath;
	storedImages: any;
	cb: ({ node, mdFile, storedImages, cb }: TraverseNodesParams) => void;
}
