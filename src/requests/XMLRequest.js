const xml2js = require('xml2js');
const RequestHandler = require('./RequestHandler');

class XMLRequest extends RequestHandler {
	constructor(url) {
		super();
		this.requestHeaders = new Headers({
			'Content-Type': 'text/xml'
		});
		return this.makeRequest(url, this.requestHeaders)
			.then(response => this.returnText(response))
			.then(text => this.parseResponse(text));
	}

	parseResponse = (xml) => {
		const parseDocument = (xml) => {
			return xml2js.parseStringPromise(xml);
		};
		const rerootDocument = (document) => {
			return document.site;
		};

		return parseDocument(xml)
			.then(doc => rerootDocument(doc));
	}
}

module.exports = XMLRequest;
