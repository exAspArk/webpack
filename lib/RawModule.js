/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Module = require("./Module");
const { OriginalSource, RawSource } = require("webpack-sources");

/** @typedef {import("./util/createHash").Hash} Hash */
/** @typedef {import("./Compilation")} Compilation */
/** @typedef {import("./Module").SourceContext} SourceContext */
/** @typedef {import("webpack-sources").Source} Source */

module.exports = class RawModule extends Module {
	constructor(source, identifier, readableIdentifier) {
		super("javascript/dynamic", null);
		this.sourceStr = source;
		this.identifierStr = identifier || this.sourceStr;
		this.readableIdentifierStr = readableIdentifier || this.identifierStr;
		this.built = false;
	}

	identifier() {
		return this.identifierStr;
	}

	size() {
		return this.sourceStr.length;
	}

	readableIdentifier(requestShortener) {
		return requestShortener.shorten(this.readableIdentifierStr);
	}

	needRebuild() {
		return false;
	}

	build(options, compilations, resolver, fs, callback) {
		this.built = true;
		this.buildMeta = {};
		this.buildInfo = {
			cacheable: true
		};
		callback();
	}

	/**
	 * @param {SourceContext} sourceContext source context
	 * @returns {Source} generated source
	 */
	source(sourceContext) {
		if (this.useSourceMap) {
			return new OriginalSource(this.sourceStr, this.identifier());
		} else {
			return new RawSource(this.sourceStr);
		}
	}

	/**
	 * @param {Hash} hash the hash used to track dependencies
	 * @param {Compilation} compilation the compilation
	 * @returns {void}
	 */
	updateHash(hash, compilation) {
		hash.update(this.sourceStr);
		super.updateHash(hash, compilation);
	}
};
