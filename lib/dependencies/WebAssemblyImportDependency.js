/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const DependencyReference = require("./DependencyReference");
const ModuleDependency = require("./ModuleDependency");
const UnsupportedWebAssemblyFeatureError = require("../wasm/UnsupportedWebAssemblyFeatureError");

/** @typedef {import("../ModuleGraph")} ModuleGraph */
/** @typedef {import("../WebpackError")} WebpackError */

class WebAssemblyImportDependency extends ModuleDependency {
	constructor(request, name, description, onlyDirectImport) {
		super(request);
		/** @type {string} */
		this.name = name;
		/** @type {TODO} */
		this.description = description;
		/** @type {false | string} */
		this.onlyDirectImport = onlyDirectImport;
	}

	/**
	 * Returns the referenced module and export
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {DependencyReference} reference
	 */
	getReference(moduleGraph) {
		const module = moduleGraph.getModule(this);
		if (!module) return null;
		return new DependencyReference(module, [this.name], false);
	}

	/**
	 * Returns errors
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[]} errors
	 */
	getErrors(moduleGraph) {
		const module = moduleGraph.getModule(this);
		if (
			this.onlyDirectImport &&
			module &&
			!module.type.startsWith("webassembly")
		) {
			return [
				new UnsupportedWebAssemblyFeatureError(
					`Import "${this.name}" from "${this.request}" with ${
						this.onlyDirectImport
					} can only be used for direct wasm to wasm dependencies`
				)
			];
		}
	}

	get type() {
		return "wasm import";
	}
}

module.exports = WebAssemblyImportDependency;
