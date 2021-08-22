import fetch from "node-fetch";
import fs from "node:fs";

const downloadImage = async (url: string, imagePath: string) => {
	const res = await fetch(url);
	const b = await res.buffer();
	fs.writeFileSync(imagePath, b);
};

export default downloadImage;
