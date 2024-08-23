// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

const weather = {};
weather.temperature = {
	unit: 'celsius',
};

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
	if (!CONFIG.trackLocation || !navigator.geolocation) {
		if (CONFIG.trackLocation) {
			console.error('Geolocation not available');
		}
		getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
		},
		err => {
			console.error(err);
			getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		}
	);
}

function getWeather(latitude, longitude) {
    let api = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
    fetch(api)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Accessing the temperature in the data response
            let temperatureData = data.properties.timeseries[0].data.instant.details.air_temperature;
            let celsius = Math.floor(temperatureData);

            // Assuming you're storing temperature in the weather object
            weather.temperature.value = tempUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;

            // Accessing the cloud coverage as a weather description
            let cloudCoverage = data.properties.timeseries[0].data.instant.details.cloud_area_fraction;

            let precipitationAmount = data.properties.timeseries[0].data.next_1_hours.details.precipitation_amount;

     	    if (cloudCoverage > 0) {
                weather.description += `, Cloud coverage: ${cloudCoverage}%`;
            }
		
            if (precipitationAmount > 0) {
                weather.description += `, Precipitation: ${precipitationAmount}mm`;
            }

            // Accessing the weather symbol code for the last hour
            let symbolCode = data.properties.timeseries[0].data.next_1_hours.summary.symbol_code;

            // Map symbolCode to Lucide icon name
            const iconMap = {
                "clearsky_day": "sun",
                "clearsky_night": "moon",
                "partlycloudy_day": "cloud-sun",
                "partlycloudy_night": "cloud-moon",
                "cloudy": "cloud",
                "rain": "cloud-rain",
                "lightrain": "cloud-drizzle",
                "heavyrain": "cloud-rain-heavy",
                "snow": "cloud-snow",
                "lightsnow": "cloud-snow-light",
                "heavysnow": "cloud-snow-heavy",
                "fog": "cloud-fog",
                "sleet": "cloud-sleet",
                "thunderstorm": "cloud-lightning"
            };

            weather.iconId = iconMap[symbolCode] || "cloud"; // default to "cloud" if no match
        })
        .then(function() {
            displayWeather();
        });
}

function displayWeather() {
    // Use Lucide icons in your HTML
    iconElement.innerHTML = `<i data-lucide="${weather.iconId}" class="lucide-icon"></i>`;
    tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
    descElement.innerHTML = weather.description;

    // Ensure Lucide icons are properly rendered
    lucide.createIcons();
}
