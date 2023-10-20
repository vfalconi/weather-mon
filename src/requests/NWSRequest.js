const RequestHandler = require('./RequestHandler');

class NWSRequest extends RequestHandler {
	constructor(url, appName, appEmail) {
		super();
		this.requestHeaders = new Headers({
			'User-Agent': `(${appName}, ${appEmail})`,
			'Accept': 'application/ld+json',
		});

		return this.makeRequest(url, this.requestHeaders)
			.then(response => this.returnJSON(response));
	}
}

module.exports = NWSRequest;
