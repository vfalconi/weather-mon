class RequestHandler {
	makeRequest = (url, headers = {}) => {
		return fetch(url, { headers }).then(response => this.handleResponse(response)).catch((e) => {
			console.error('error', e);
		});
	}

	handleResponse = (response) => {
		if (!response.ok) {
			throw new Error(`request not ok: ${response.url}`);
		}

		if (response.status === 200) {
			console.info(`Request ok: ${response.url}`);
			return response;
		}

		throw new Error(`service unavailable: ${response.url}`);
	}

	returnJSON = (response) => {
		return response.json();
	}

	returnText = (response) => {
		return response.text();
	}
}

module.exports = RequestHandler;
