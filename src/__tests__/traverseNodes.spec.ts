import { jest } from "@jest/globals";
import markdown from "./common/markdown";
import { remark } from "remark";
import path from "path";
import traverseNodes from "../traverseNodes";
import traverseNextNodes from "../traverseNextNodes";

describe("suite name", () => {
	const syntaxTree = remark().parse(markdown);
	// const traverse = jest.fn(traverseNodes);
	const cb = jest.fn(traverseNextNodes);

	test("empty test", () => {
		traverseNodes({
			node: syntaxTree,
			mdFile: path.parse("some/file.md"),
			storedImages: {},
			cb: cb,
		});
		expect(1).toBe(1);
		expect(markdown).not.toBe(undefined);
	});
});
