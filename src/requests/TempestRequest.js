const RequestHandler = require('./RequestHandler');

class TempestRequest extends RequestHandler {
	constructor(stationId, token) {
		super();

		return this.makeRequest(`https://swd.weatherflow.com/swd/rest/observations/station/${stationId}?token=${token}`)
			.then(response => this.returnJSON(response));
	}
}

module.exports = TempestRequest;
