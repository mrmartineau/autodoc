#! /usr/bin/env node
var autodoc = require('./');
var program = require('commander');
var version = require('./package').version
var copyPaste = require('copy-paste');

var userArgs = process.argv.slice(2);

/**
 * TODO:
 * - Options:
 *   - print in the console ✔
 *   - generate a new file
 *   - copy to clipbpard ✔
 * - Defaults:
 *   - print ✔
 *   - if there's no argument, try to use a package.json from the cwd. ✔
 */

program
	.version(version)
	.option('-f, --file', 'The file you are parsing', 'package.json')
	.option('-g, --generate', 'Generate a markdown file of the result')
	.option('-p, --print', 'Print result to the console')
	.option('-c, --copy', 'Copy result to clipboard')
	.parse(process.argv);

var result;

// If there is no argv, try to use a package.json in the same directory
if (userArgs[0].indexOf('package.json') === -1) {
	// console.log('no argv');
	result = autodoc('package.json');
} else {
	// autodoc(program.file); // or
	result = autodoc(userArgs[0]);
}

if (program.generate) {
	// Generate a markdown file
	console.log('cli generate: '+ result);
}

if (program.print) {
	// Print to console
	console.log(result);
}

if (program.copy) {
	// Copy to clipboard
	copyPaste.copy(result);
}
