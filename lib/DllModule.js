/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	*/
"use strict";

const { RawSource } = require("webpack-sources");
const Module = require("./Module");

/** @typedef {import("./util/createHash").Hash} Hash */
/** @typedef {import("./Compilation")} Compilation */
/** @typedef {import("./Module").SourceContext} SourceContext */
/** @typedef {import("webpack-sources").Source} Source */

class DllModule extends Module {
	constructor(context, dependencies, name, type) {
		super("javascript/dynamic", context);

		// Info from Factory
		this.dependencies = dependencies;
		this.name = name;
		this.type = type;
	}

	identifier() {
		return `dll ${this.name}`;
	}

	readableIdentifier() {
		return `dll ${this.name}`;
	}

	build(options, compilation, resolver, fs, callback) {
		this.built = true;
		this.buildMeta = {};
		this.buildInfo = {};
		return callback();
	}

	/**
	 * @param {SourceContext} sourceContext source context
	 * @returns {Source} generated source
	 */
	source(sourceContext) {
		return new RawSource("module.exports = __webpack_require__;");
	}

	needRebuild() {
		return false;
	}

	size() {
		return 12;
	}

	/**
	 * @param {Hash} hash the hash used to track dependencies
	 * @param {Compilation} compilation the compilation
	 * @returns {void}
	 */
	updateHash(hash, compilation) {
		hash.update("dll module");
		hash.update(this.name || "");
		super.updateHash(hash, compilation);
	}
}

module.exports = DllModule;
