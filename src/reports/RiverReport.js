const { XMLRequest } = require('../requests');

module.exports = class RiverReport {
	constructor(guage) {
		this.guage = guage;
		this.report = new XMLRequest(`https://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=${this.guage}&output=xml`).then(response => this.parseReport(response));
		return this.report;
	}



	parseReport = (report) => {
		const formatData = (item, state) => {
			const p = {
				measurement: 'hydrology',
				time: item?.valid[0]?._,
				values: new Map(),
				tags: new Map([
					[ 'guage', report?.['$']?.id ],
					[ 'state', state ],
				]),
			};
			const primary = {
				metric: item?.primary?.[0]?.['$']?.name.toLowerCase(),
				value: parseFloat(item?.primary?.[0]?._,),
			}
			const secondary = {
				metric: item?.secondary?.[0]?.['$']?.name.toLowerCase(),
				value: parseFloat(item?.secondary?.[0]?._,),
			}

			p.values.set(primary.metric, primary.value);

			if (secondary.metric !== undefined) {
				p.values.set(secondary.metric, secondary.value);
			}

			return p;
		};
		const observed = (report?.observed[0]?.datum || []).map(q => formatData(q, 'observed'));
		const forecast = (report?.forecast[0]?.datum || []).map(q => formatData(q, 'forecast'));

		return {
			observed,
			forecast,
		};
	}
}
