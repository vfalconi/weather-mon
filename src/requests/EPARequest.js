const RequestHandler = require('./RequestHandler');

class EPARequest extends RequestHandler {
	constructor(url) {
		super();

		return this.makeRequest(url)
			.then(response => this.returnJSON(response));
	}
}

module.exports = EPARequest;
