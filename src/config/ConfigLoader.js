const { readFileSync } = require('node:fs');
const kdl = require('kdljs');

module.exports = class ConfigLoader {
	constructor(optConfigPath = false) {
		if (optConfigPath) {
			// optional app-defined path
			this.pathToConfig = optConfigPath;
		} else if (process.env.CONFIG_PATH) {
			// optional user-defined path
			this.pathToConfig = process.env.CONFIG_PATH;
		} else {
			// default path
			this.pathToConfig = `${process.env.PWD}/config.kdl`;
		}

		this.source = readFileSync(this.pathToConfig, 'utf8');
		this.kdlDoc = this.parseConfigFile();
	}

	parseConfigFile = () => {
		const parsedConfig = kdl.parse(this.source);

		if (parsedConfig.errors.length > 0) {
			throw new Error(parsedConfig.errors);
		}

		return parsedConfig.output;
	}

	query = (q) => {
		const results = kdl.query(this.kdlDoc, q);

		if (results.length === 1) return results[0];

		return results;
	};

	getSettings = (configGroup) => {
		const nodes = this.query(configGroup).children;
		const settings = new Map();

		if (nodes === undefined) {
			return settings;
		}

		nodes.forEach(node => {
			let values;

			if (node.values.length === 0 && node.children.length > 0) {
				// this is a List block
				values = node.children.map(c => c.name);
			} else if (node.values.length === 1 && node.children.length === 0) {
				// this is a single value kv pair
				values = node.values[0];
			} else if (node.values.length > 1 && node.children.length === 0) {
				// this is a kv pair with an array value
				values = node.values;
			} else if (node.values.length === 0 && Object.keys(node.properties).length > 0) {
				// this has PROPERTIES and no VALUES, who is SHE
				values = { ...node.properties };
			} else if (node.values.length > 0 && Object.keys(node.properties).length > 0) {
				//this has BOTH properties AND values, oh she's RICH
				values = { values: [ ...node.values ], ...node.properties };
			}

			settings.set(node.name, values);
		});
		return settings;
	};
}
