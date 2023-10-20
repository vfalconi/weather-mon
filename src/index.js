const { RiverReport, WeatherReport, AQIReport, UVIReport, TempestReport } = require('./reports');
const { PushData } = require('./PushData');
const { app, airnow, nws, postalCodes, tempest } = require('./config');
const reports = [
	(nws.get('gauges').length > 0 ? nws.get('gauges').map(gauge => new RiverReport(gauge)) : []),
	(nws.get('stations').length > 0 ? nws.get('stations').map(station => new WeatherReport(station, app.name, nws.get('ua_email'))) : []),
	(tempest.get('stations').length > 0 ? tempest.get('stations').map(station => new TempestReport(station, tempest.get('token'))) : []),
	(postalCodes.size > 0 ? Array.from(postalCodes.keys()).map(code => new AQIReport(code, postalCodes.get(code).offset, airnow.get('apikey'))) : []),
	//(postalCodes.size > 0 ? Arry.from(postalCodes.keys()).map(code => new UVIReport(code)) : []),
];

Promise.all(reports.flat()).then(results => {

	const db = new PushData();

	results.forEach(i => {
		if (i.observed !== undefined) {
			db.addPoints(i.observed);
		}

		if (i.forecast !== undefined) {
			db.addPoints(i.forecast);
		}
	});

	return db;
})
.then(db => {
	db.write().catch(e => {
		console.error(e);
	});
	console.info(`Finished writing ${db.points.length} data points`);
})
.catch(e => {
	console.error('error', e);
})
