const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { influxdb } = require('./config');

class PushData {
	constructor() {
		this.points = [];
	}

	addPoints = (points) => {
		points.forEach(point => {
			const p = new Point(point.measurement);

			p.timestamp(new Date(point.time));

			try {
				point.values.forEach((value, key) => {
					if (value !== undefined && value !== null) {
						if ('number' === typeof value) {
							p.floatField(key, value);
						}

						if ('string' === typeof value) {
							p.stringField(key, value);
						}
					}
				});

				point.tags.forEach((value, key) => p.tag(key, value));
			} catch (e) {
				console.error(...e);
			}

			this.points.push(p);

		});

		return this.points;
	}

	write = () => {
		const client = new InfluxDB({ url: influxdb.get('endpoint'), token: influxdb.get('token') });
		const writeApi = client.getWriteApi(influxdb.get('org'), influxdb.get('bucket'));

		if (this.points.length > 0) {
			writeApi.writePoints(this.points);
		}

		return writeApi.close();
	}
}

module.exports = {
	PushData,
}
