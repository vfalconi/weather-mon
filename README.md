# weather-mon

A KDL-driven weather data scraper.

## Requirements

1. An InfluxDB instance

## Installation/usage

1. Clone repo
2. Write configuration
2. Run `npm start`

## Configuration

weather-mon uses [KDL](https://kdl.dev) for its instructions, broken out into the following groups:

- [`app`](#app)
- [`influxdb`](#influxdb)
- [`nws`](#nws)
- [`airnow`](#airnow)
- [`postalCodes`](#postalcodes)
- [`tempest`](#tempest)

Refer to the example config for the expected structure, and [kdl.dev](https://kdl.dev) for syntax.

### Overriding the default path to the config document

The scraper expects a KDL document named `config.kdl` in the project root. If you want to load a different KDL document, you can pass in a custom path via the `CONFIG_PATH` variable at runtime.

### `app`

| setting | description | required | default |
|--------|--------|--------|--------|
| `environment` | not used anymore. this was for the (removed) logger. | | |
| `name` | this is used to identify the scraper with the NWS API | yes | 'weather-mon' |

### `influxdb`

| setting | description | required | default |
|--------|--------|--------|--------|
| `token` | The API token for the scraper. Needs to have write access for the `bucket`. | yes | |
| `endpoint` | The URL for the InfluxDB instance. It can include a port. | yes | |
| `org` | The name of the InfluxDB organization | yes | |
| `bucket` | The name of the InfluxDB bucket where your data is going to land | yes | |

### `nws`

| setting | description | required | default |
|--------|--------|--------|--------|
| `ua_email` | The user-agent email required by the NWS API. | yes | |
| `gauges` | A list of NOAA river gauge IDs. | | |
| `stations` | A list of NWS weather stations. | | |

### `airnow`

| setting | description | required | default |
|--------|--------|--------|--------|
| `apikey` | The auth token for the Airnow AQI API | yes | |

### `postalCodes`

This is a list of postal codes with the following properties:

| setting | description | required | default |
|--------|--------|--------|--------|
| `offset` | The timezone offset for the postal code. Needed to record the date correctly. | yes | |

### `tempest`

| setting | description | required | default |
|--------|--------|--------|--------|
| `token` | The PAT for the [Tempest Weather](https://www.tempestwx.com/) API. | yes | |
| `stations` | A list of station IDs to scrape. | | |

## Data Sources

Weather data: https://www.weather.gov/documentation/services-web-api

River data: https://water.weather.gov/ahps/

AQI data: https://docs.airnowapi.org/

UVI data: https://www.epa.gov/enviro/web-services

Tempest: https://apidocs.tempestwx.com/reference/quick-start
