/**
 * Autodoc
 * @author: Zander Martineau
 *
 * USAGE:
 * autodoc package.json ✔
 * autodoc https://raw.githubusercontent.com/TryKickoff/kickoff/master/package.json
 *
 * TODO:
 * - take a package.json as input ✔
 *   - could give a Github or Bitbucket repo url instead
 * - find dependencies prop & parse ✔
 * - loop through each one & grab some info about each ✔
 *   - Name ✔
 *   - NPM/Github URL ✔
 *   - Description ✔
 *   - etc ✔
 * - Generate markdown with this information so that it can be copied into a readme
 *   - output in the console ✔
 *   - generate a new file
 *   - improve the output (e.g. highlighting)
 * - Create better CLI experience using commander.js
 *   - This should be placed in cli.js and requires this ✔
 * - Create an online version that takes json pasted in a textarea
 */

var fs = require('fs');
var _ = require('lodash');
var got = require('got');
var registryUrl = require('registry-url')();

function autodoc(packageURL) {
	if (packageURL.indexOf('github') > 0) {
		// console.log('package is from the net');
		var newPackageUrl = packageURL.replace('https://raw.githubusercontent.com', 'https://rawgit.com')
		// console.log('newPackageUrl', newPackageUrl);
		got(newPackageUrl, function (err, data, res) {
			console.log('line 31', res.buffer);
			// TODO: investigate the buffer
			getPackageInformation(err, res.buffer);
		});

	} else {

		// console.log('File is on local system');
		fs.readFile(packageURL, function (err, data) {
			getPackageInformation(err, data);
		});

	}
}

/**
 * Get package.json contents
 */
function getPackageInformation(err, data) {
	if (err) throw err;
	console.log('line 60', data);
	var deps = JSON.parse(data).dependencies;
	// console.log('deps', deps);

	_.forIn(deps, function(value, key) {
		// console.log('keyValue', key+ '@' +value);

		got(registryUrl + key)
			.then(function (res) {
				var packageInfo = JSON.parse(res.body);
				var name = packageInfo.name;
				var description = packageInfo.description;
				var install = 'npm install '+ name;
				var homepage = packageInfo.homepage;
				var issues = packageInfo.bugs.url;
				var repo = packageInfo.repository;
				var license = packageInfo.license;

				console.log('## ['+ name +']('+ homepage +')');
				console.log('### '+ description);
				console.log('[npm](http://npmjs.org/'+ key +') - [Homepage]('+ homepage +') - [Repository]('+ repo.url +') ('+ repo.type +') - [Issues]('+ issues +') - Licence: '+ license);
				console.log('\nInstall with `'+ install +'`');
				console.log('\n---\n');
			})
			.catch(function (err) {
				console.error(err);
				console.error(err.response && err.response.body);
			});
	});
}

module.exports = autodoc;
