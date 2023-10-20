const { TempestRequest } = require('../requests');

module.exports = class TempestReport {
	constructor(stationId = null, token) {
		if (stationId === null) {
			throw new Error('station is required');
		}

		this.stationId = stationId;
		this.observed = new TempestRequest(this.stationId, token)
			.then(obs => this.parseObservations(obs));

		return Promise.all([
			this.observed,
		]).then(results => {
			return {
				observed: results[0],
			};
		});
	}

	parseObservations = (observations) => {
		const data = { ...observations };

		return data.obs.map(observations => {
			return {
				time: (observations.timestamp * 1000),
				measurement: 'weather',
				tags: new Map([
					[ 'station', this.stationId ],
					[ 'state', 'observed' ],
				]),
				values: new Map(data.outdoor_keys.filter(key => key !== 'timestamp').map(key => {
					return [ key, observations[key] ]
				})),
			}
		});
	};
}
