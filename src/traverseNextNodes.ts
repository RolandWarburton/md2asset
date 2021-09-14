import { traverseNodes } from "./traverseNodes.js";
import { TraverseNodesParams } from "./interfaces/TraverseNodesParams.js";

// takes the current node and traverses all of its children
export default function traverseNextNodes({
	node,
	mdFile,
	storedImages,
	cb,
}: TraverseNodesParams): void {
	// if there are children on this node, then we need to traverse them as well (recursively)
	if (node.children) {
		node.children.forEach((child: any) => {
			// the callback will make this recursive by providing traverseNodes with the ability
			// to call traverseNextNodes on the child node once it is done
			traverseNodes({ node: child, mdFile, storedImages, cb });
		});
	}
}
