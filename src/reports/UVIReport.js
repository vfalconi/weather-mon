const { RequestHandler } = require('../requests');
const { reformatDate, formatOffset } = require('../helpers');

module.exports = class UVIReport extends RequestHandler {
	constructor(geoIds) {
		super();
		const ids = geoIds.split(':')
		this.postalCode = ids[0];
		this.offset = formatOffset(ids[1]);
		this.forecast = new EPARequest(`https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${this.postalCode}/json`)
			.then(forecast => this.parseForecast(forecast));

		return Promise.all([ this.forecast ]).then(reports => {
			return {
				postalCode: this.postalCode,
				forecast: reports[0],
			}
		});
	}

	parseForecast = (response) => {
		const dataPoints = response.map(d => {
			return {
				time: `${reformatDate(d.DATE_TIME)}${this.offset}`,
				measurement: 'UVI',
				values: new Map([
					[ 'UVI', d.UV_VALUE ],
				]),
				tags: new Map([
					[ 'postalCode', d.ZIP ],
					[ 'state', 'forecast' ],
				]),
			}
		});

		return dataPoints;
	}
}
