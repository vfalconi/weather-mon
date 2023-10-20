const { NWSRequest } = require('../requests');

module.exports = class WeatherReport {
	constructor(stationId, appName, appEmail, onlyLatest = null) {
		if (stationId === null) {
			throw new Error('station is required');
		}

		this.stationId = stationId;
		this.onlyLatest = (onlyLatest === true);

		this.station = new NWSRequest(`https://api.weather.gov/stations/${this.stationId}`, appName, appEmail)
			.then(station => this.parseStation(station));

		this.report = new NWSRequest(`https://api.weather.gov/stations/${this.stationId}/observations${this.onlyLatest ? '/latest' : ''}`, appName, appEmail)
			.then(observations => this.parseObservations(observations));

		return Promise.all([
			this.station,
			this.report,
		]).then(responses => {
			return {
				station: responses[0],
				observed: responses[1],
			}
		});
	}

	parseStation = (station) => {
		return {
			id: station?.stationIdentifier,
			elevation: station?.elevation?.value,
			timezone: station?.timeZone,
			county: station?.county,
			fireWeatherZone: station?.fireWeatherZone,
			forecast: station?.forecast,
			geometry: station?.geometry,
			name: station?.name,
		};
	}

	parseObservations = (observations) => {
		const data = { ...observations };

		if (data['@graph'] !== undefined) {
			return data['@graph'].map(this.parseObservations).flat();
		}

		return [{
			time: data.timestamp,
			measurement: 'weather',
			tags: new Map([
				[ 'station', this.stationId ],
				[ 'state', 'observed' ]
			]),
			values: new Map([
				[ 'temperature', data?.temperature.value ],
				[ 'dewpoint', data?.dewpoint.value ],
				[ 'windDirection', data?.windDirection.value ],
				[ 'windSpeed', data?.windSpeed.value ],
				[ 'windGust', data?.windGust.value ],
				[ 'barometricPressure', data?.barometricPressure.value ],
				[ 'seaLevelPressure', data?.seaLevelPressure.value ],
				[ 'visibility', data?.visibility.value ],
				[ 'maxTemperatureLast24Hours', data?.maxTemperatureLast24Hours.value ],
				[ 'minTemperatureLast24Hours', data?.minTemperatureLast24Hours.value ],
				[ 'precipitationLastHour', data?.precipitationLastHour.value ],
				[ 'precipitationLast3Hours', data?.precipitationLast3Hours.value ],
				[ 'precipitationLast6Hours', data?.precipitationLast6Hours.value ],
				[ 'relativeHumidity', data?.relativeHumidity.value ],
				[ 'windChill', data?.windChill.value ],
				[ 'heatIndex', data?.heatIndex.value ],
				[ 'maxTemperature', data?.maxTemperature?.value ],
				[ 'minTemperature', data?.minTemperature?.value ],
				[ 'apparentTemperature', data?.apparentTemperature?.value ],
				[ 'heatIndex', data?.heatIndex?.value ],
				[ 'windChill', data?.windChill?.value ],
				[ 'skyCover', data?.skyCover?.value ],
				[ 'probabilityOfPrecipitation', data?.probabilityOfPrecipitation?.value ],
				[ 'quantitativePrecipitation', data?.quantitativePrecipitation?.value ],
				[ 'iceAccumulation', data?.iceAccumulation?.value ],
				[ 'snowfallAmount', data?.snowfallAmount?.value ],
				[ 'ceilingHeight', data?.ceilingHeight?.value ],
				[ 'visibility', data?.visibility?.value ],
				[ 'transportWindSpeed', data?.transportWindSpeed?.value ],
				[ 'transportWindDirection', data?.transportWindDirection?.value ],
				[ 'mixingHeight', data?.mixingHeight?.value ],
				[ 'lightningActivityLevel', data?.lightningActivityLevel?.value ],
				[ 'twentyFootWindSpeed', data?.twentyFootWindSpeed?.value ],
				[ 'twentyFootWindDirection', data?.twentyFootWindDirection?.value ],
				[ 'lowVisibilityOccurrenceRiskIndex', data?.lowVisibilityOccurrenceRiskIndex?.value ],
				/*
				**	other fields that i don't know what they look like:
				**		hazards: data?.hazards,
				**		weather: data?.weather,
				**		snowLevel: data?.snowLevel,
				**		hainesIndex: data?.hainesIndex,
				**		waveHeight: data?.waveHeight,
				**		wavePeriod: data?.wavePeriod,
				**		waveDirection: data?.waveDirection,
				**		primarySwellHeight: data?.primarySwellHeight,
				**		primarySwellDirection: data?.primarySwellDirection,
				**		secondarySwellHeight: data?.secondarySwellHeight,
				**		secondarySwellDirection: data?.secondarySwellDirection,
				**		wavePeriod2: data?.wavePeriod2,
				**		windWaveHeight: data?.windWaveHeight,
				**		dispersionIndex: data?.dispersionIndex,
				**		pressure: data?.pressure,
				**		probabilityOfTropicalStormWinds: data?.probabilityOfTropicalStormWinds,
				**		probabilityOfHurricaneWinds: data?.probabilityOfHurricaneWinds,
				**		potentialOf15mphWinds: data?.potentialOf15mphWinds,
				**		potentialOf25mphWinds: data?.potentialOf25mphWinds,
				**		potentialOf35mphWinds: data?.potentialOf35mphWinds,
				**		potentialOf45mphWinds: data?.potentialOf45mphWinds,
				**		potentialOf20mphWindGusts: data?.potentialOf20mphWindGusts,
				**		potentialOf30mphWindGusts: data?.potentialOf30mphWindGusts,
				**		potentialOf40mphWindGusts: data?.potentialOf40mphWindGusts,
				**		potentialOf50mphWindGusts: data?.potentialOf50mphWindGusts,
				**		potentialOf60mphWindGusts: data?.potentialOf60mphWindGusts,
				**		grasslandFireDangerIndex: data?.grasslandFireDangerIndex,
				**		probabilityOfThunder: data?.probabilityOfThunder,
				**		davisStabilityIndex: data?.davisStabilityIndex,
				**		atmosphericDispersionIndex: data?.atmosphericDispersionIndex,
				**		stability: data?.stability,
				**		redFlagThreatIndex: data?.redFlagThreatIndex,
				*/
			]),
		}];
	}
}
