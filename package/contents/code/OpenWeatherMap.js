.import "../ui/lib/Requests.js" as Requests

function openOpenWeatherMapCityUrl(cityId) {
	var url = 'https://openweathermap.org/city/'
	url += cityId
	Qt.openUrlExternally(url)
}

function fetchHourlyWeatherForecast(args, callback) {
	if (!args.app_id) return callback('OpenWeatherMap AppId not set')
	if (!args.city_id) return callback('OpenWeatherMap CityId not set')

	// return testRateLimitError(callback)

	var url = 'https://api.openweathermap.org/data/2.5/'
	url += 'forecast?id=' + args.city_id
	url += '&units=' + (args.units || 'metric')
	url += '&appid=' + args.app_id
	Requests.getJSON(url, callback)
}

function fetchDailyWeatherForecast(args, callback) {
	if (!args.app_id) return callback('OpenWeatherMap AppId not set')
	if (!args.city_id) return callback('OpenWeatherMap CityId not set')

	// return testRateLimitError(callback)

	var url = 'https://api.openweathermap.org/data/2.5/'
	url += 'forecast/daily?id=' + args.city_id
	url += '&units=' + (args.units || 'metric')
	url += '&appid=' + args.app_id
	Requests.getJSON(url, callback)
}

// https://openweathermap.org/weather-conditions
var weatherIconMap = {
	'01d': 'weather-clear',
	'02d': 'weather-few-clouds',
	'03d': 'weather-clouds',
	'04d': 'weather-overcast',
	'09d': 'weather-showers-scattered',
	'10d': 'weather-showers',
	'11d': 'weather-storm',
	'13d': 'weather-snow',
	'50d': 'weather-fog',
	'01n': 'weather-clear-night',
	'02n': 'weather-few-clouds-night',
	'03n': 'weather-clouds-night',
	'04n': 'weather-overcast',
	'09n': 'weather-showers-scattered-night',
	'10n': 'weather-showers-night',
	'11n': 'weather-storm-night',
	'13n': 'weather-snow',
	'50n': 'weather-fog',
}

function parseDailyData(weatherData) {
	for (var j = 0; j < weatherData.list.length; j++) {
		var forecastItem = weatherData.list[j]

		forecastItem.iconName = weatherIconMap[forecastItem.weather[0].icon]
		forecastItem.text = forecastItem.weather[0].main
		forecastItem.description = forecastItem.weather[0].description
		
		var lines = []
		lines.push('<b>Morning:</b> ' + Math.round(forecastItem.temp.morn) + '°')
		lines.push('<b>Day:</b> ' + Math.round(forecastItem.temp.day) + '°')
		lines.push('<b>Evening:</b> ' + Math.round(forecastItem.temp.eve) + '°')
		lines.push('<b>Night:</b> ' + Math.round(forecastItem.temp.night) + '°')
		forecastItem.notes = lines.join('<br>')
	}

	return weatherData
}

function parseHourlyData(weatherData) {
	for (var j = 0; j < weatherData.list.length; j++) {
		var forecastItem = weatherData.list[j]
		
		forecastItem.temp = forecastItem.main.temp
		forecastItem.iconName = weatherIconMap[forecastItem.weather[0].icon]
		// forecastItem.text = forecastItem.weather[0].main
		forecastItem.description = forecastItem.weather[0].description

		var rain = forecastItem.rain && forecastItem.rain['3h'] || 0
		var snow = forecastItem.snow && forecastItem.snow['3h'] || 0
		var mm = rain + snow
		forecastItem.precipitation = mm
	}

	return weatherData
}

function handleError(funcName, callback, err, data, xhr) {
	logger.logJSON(funcName + '.err', err, xhr && xhr.status, data)
	return callback(err, data, xhr)
}

function updateDailyWeather(callback) {
	logger.debug('fetchDailyWeatherForecast', lastForecastAt, Date.now())
	fetchDailyWeatherForecast({
		app_id: plasmoid.configuration.weather_app_id,
		city_id: plasmoid.configuration.weather_city_id,
		units: plasmoid.configuration.weather_units,
	}, function(err, data, xhr) {
		if (err) return handleError('fetchDailyWeatherForecast', callback, err, data, xhr)
		logger.debug('fetchDailyWeatherForecast.response')
		// logger.debugJSON('fetchDailyWeatherForecast.response', data)

		data = parseDailyData(data)

		callback(err, data)
	})
}

function updateHourlyWeather(callback) {
	logger.debug('fetchHourlyWeatherForecast', lastForecastAt, Date.now())
	fetchHourlyWeatherForecast({
		app_id: plasmoid.configuration.weather_app_id,
		city_id: plasmoid.configuration.weather_city_id,
		units: plasmoid.configuration.weather_units,
	}, function(err, data, xhr) {
		if (err) return handleError('updateHourlyWeather', callback, err, data, xhr)
		logger.debug('fetchHourlyWeatherForecast.response')
		// logger.debugJSON('fetchHourlyWeatherForecast.response', data)

		data = parseHourlyData(data)

		callback(err, data, xhr)
	})
}

//--- Tests
function testRateLimitError(callback) {
	var err = 'HTTP Error 429: '
	var data = {
		"cod":429,
		"message": "Your account is temporary blocked due to exceeding of requests limitation of your subscription type. Please choose the proper subscription http://openweathermap.org/price"
	}
	var xhr = { status: 429 }
	return callback(err, data, xhr)
}
