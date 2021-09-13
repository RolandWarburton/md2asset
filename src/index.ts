//
// Markdown url to local asset generator
// Author: https://github.com/RolandWarburton
//

// =================================================================================================
// Note:
// Currently for development ts-node with the `npm run dev` script imports need a .js extension.
//     This is a requirement for the ts-node compiler to work with esm.
//     See https://github.com/TypeStrong/ts-node/issues/1007 for more information.
//     > Include file extensions in your import statements,
//     > or pass the --experimental-specifier-resolution=node Idiomatic
//     > TypeScript should import foo.ts as import 'foo.js'; TypeScript understands this.
//
// Overall this file is not really needed unless you want to make rapid changes to the code
// and re-generate the markdown over and over.

// =================================================================================================
// TODO:
//  - Add unit testing to avoid needing to use dev script (faster and better code quality)
//  - Do not download the same image twice, check if it exists first already before downloading
//  - Add support for multiple files to be parsed at a time

import app from "./app.js";
app(process.argv);
