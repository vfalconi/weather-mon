const ConfigLoader = require('./ConfigLoader');

const config = (path = false) => {
	const srcConfig = new ConfigLoader(path);
	const influxdb = srcConfig.getSettings('influxdb');
	const airnow = srcConfig.getSettings('airnow');
	const tempest = srcConfig.getSettings('tempest');
	const app = srcConfig.getSettings('app');
	const postalCodes = srcConfig.getSettings('postalCodes');
	const nws = srcConfig.getSettings('nws');

	return {
		influxdb,
		nws,
		airnow,
		tempest,
		app,
		postalCodes,
	};
};

module.exports = config();
