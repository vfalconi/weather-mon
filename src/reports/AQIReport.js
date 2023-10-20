const airnow = require('airnow');

module.exports = class AQIReport {
	constructor({ postalCode, offset, apiKey }) {
		this.postalCode = postalCode;
		this.offset = offset;
		this.client = airnow({ apiKey });
		this.observed = this.getObservations(this.postalCode).then(obs => this.createPoints('observed', obs));
		this.forecast = this.getForecast(this.postalCode).then(forecast => this.createPoints('forecast', forecast));

		return Promise.all([ this.observed, this.forecast ]).then(reports => {
			return {
				zipCode: this.postalCode,
				observed: reports[0],
				forecast: reports[1],
			}
		});
	}

	getObservations = (zipCode) => {
		return new Promise((resolve, reject) => {
			this.client.getObservationsByZipCode({ zipCode }, function(err, observations) {
				if (err) reject(err);

				resolve(observations);
			});
		});
	}

	getForecast = (zipCode) => {
		return new Promise((resolve, reject) => {
			this.client.getForecastByZipCode({
				zipCode,
				distance: 1000,
			}, function(err, forecast) {
				if (err) reject(err);

				resolve(forecast);
			});
		});
	}

	createPoints = (state, data) => {
		if (!Array.isArray(data)) return [];
		return data.map(d => {
			let time;
			if (state === 'observed') {
				time = `${d.DateObserved}${d.HourObserved}:00:00`;
			}

			if (state === 'forecast') {
				time = d.DateForecast;
			}

			return {
				time,
				measurement: 'AQI',
				values: new Map([
					[ d.ParameterName, d.AQI ],
					[ `${d.ParameterName}_rating`, d.Category.Number ],
					[ `${d.ParameterName}_rating-name`, d.Category.Name ],
				]),
				tags: new Map([
					[ 'area', d.ReportingArea ],
					[ 'state', state ],
					[ 'postal_code', this.postalCode ],
				]),
			}
		});
	}
};
