const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const hapi = require('hapi');
const inert = require('inert');
const phantom = require('phantomjs-prebuilt');
const childProcess = require('child_process');
const portFinder = require('portfinder');
const util = require('util');

/**
 * @typedef {{
 *   indexPath: string
 *   phantomOptions: any
 *   ignoreJSErrors: boolean,
 *   navigationLocked: boolean,
 *   phantomPageSettings:
 * }} Options
 */

/**
 * Render HTML file by PhantomJS and retrieve computed HTML.
 *
 * @param staticDir server root directory
 * @param htmlPath HTML path from staticDir
 * @param options {Options} options
 * @returns {Promise} computed html strings
 */
async function compileToHTML(staticDir, htmlPath, options) {
	let port = await util.promisify(portFinder.getPort)();
	let server = new hapi.Server({
		connections: {
			routes: {
				files: {
					relativeTo: staticDir
				}
			}
		}
	});
	
	server.connection({ port: port });
	
	await new Promise((resolve, reject) => server.register(inert, err => err ? reject(err) : resolve()));
	
	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: '.',
				redirectToSlash: true,
				index: true
			}
		}
	});
	
	await new Promise((resolve, reject) => server.start(err => err ? reject(err) : resolve()));
	
	let phantomArguments = [
		path.join(__dirname, 'phantom-page-render.js'),
		`http://localhost:${port}${htmlPath}`,
		JSON.stringify(options)
	];
	if (options.phantomOptions) {
		phantomArguments.unshift(options.phantomOptions)
	}
	
	let stdout = '';
	let stderr = '';
	
	try {
		[stdout, stderr] = await new Promise((resolve, reject) => childProcess.execFile(
			phantom.path,
			phantomArguments,
			{ maxBuffer: 1048576 },
			(err, stdout, stderr) => err ? reject(err) : resolve([stdout, stderr]))
		);
		
	} catch (err) {
		if (err) throw Error(stderr);
	}
	
	if (stderr) console.warn(stderr);
	
	server.stop();
	
	return stdout;
}

class PrerenderSpaPlugin {
	constructor(staticDir, paths, options) {
		this.staticDir = staticDir;
		this.paths = paths;
		this.options = options || {};
	}
	
	// noinspection JSUnusedGlobalSymbols
	apply(compiler) {
		compiler.plugin('after-emit', async(compilation, done) => {
			await this.paths.map(
				async outputPath => {
					let filePath = path.join(this.staticDir, outputPath);
					let html = await compileToHTML(this.staticDir, outputPath, this.options);
					
					if (this.options.postProcessHtml) {
						html = this.options.postProcessHtml({
							html: html,
							route: outputPath
						});
					}
					
					await util.promisify(fs.writeFile)(filePath, html);
				});
			
			done();
		});
	}
}

module.exports = PrerenderSpaPlugin;
