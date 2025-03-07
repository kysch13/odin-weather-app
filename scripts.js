const elements = (function() {
    const body = document.querySelector('body');
    const searchCont = document.getElementById('search-cont');
    const searchInput = document.getElementById('search-bar');
    const loader = document.querySelector('.loader');
    const errorMsg = document.getElementById('error-msg');
    const forecastBox = document.getElementById('forecast-box');
    const untisToggle = document.getElementById('units-toggle');
    const sevenDayForecast = document.getElementById('sevenday-forecast-card-cont');
    const currentWeatherCard = document.getElementById('current-weather-card');
    const locationHeader = document.querySelector('.location-header h2');
    const currentCondMain = document.querySelector('.current-conditions-main');
    const currentCondSecondary = document.querySelector('.current-conditions-secondary');

    return {searchCont, searchInput, loader, errorMsg, forecastBox, untisToggle, sevenDayForecast, currentWeatherCard, locationHeader, currentCondMain, currentCondSecondary, body}
})();

const createIcon = function (icon) {
    const img = document.createElement('img');
    img.alt = icon;
    img.src = `./img/icons/${icon}.png`;
    return img;
}

const weatherQuery = {
    location: 'Toronto, Ontario',
    units: 'metric',
}

const weatherData = {}

const requestData = async function() {
    const apiKey = 'ZQKWB8FWZ8XLGKDY8G3XZ573J';
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherQuery.location}?key=${apiKey}&unitGroup=${weatherQuery.units}`, {mode: 'cors'});
        if (response.status === 200) {
            const responseData = await response.json();
            weatherData.currentConditions = responseData.currentConditions;
            weatherData.description = responseData.description;
            weatherData.forecast = responseData.days;
            weatherData.location = responseData.resolvedAddress;
            weatherData.background = responseData.currentConditions.conditions;
            populateDashboard();
        }
        if (response.status === 400) {
            displayErrorMsg(`Sorry, no results were found for your location.`);
        }
    } catch (error) {
        console.error(error);
        displayErrorMsg(`Something's gone wrong. Please try again later.`);
    }
}

function displayErrorMsg(msg){
    clearDashboard();
    elements.errorMsg.innerText = msg;
    elements.errorMsg.classList.add('active');
}

function getWeekDay(date) {
    let day = new Date(date+'T00:00:00');
    return day.toLocaleDateString('en-US', { weekday: 'long' });
}

function clearDashboard() {
    elements.sevenDayForecast.innerHTML = '';
    elements.locationHeader.innerHTML = '';
    elements.currentCondMain.innerHTML = '';
    elements.currentCondSecondary.innerHTML = '';
    elements.loader.classList.remove('active');
    elements.errorMsg.classList.remove('active');
    elements.body.classList.remove('day');
    elements.body.classList.remove('night');

}

function displayLoader() {
    clearDashboard();
    elements.loader.classList.add('active');
}

const populateDashboard = function() {
    clearDashboard();
    setBackground();
    elements.locationHeader.innerText = weatherData.location;
    const currentCondCard = createCurrentCondCard();
    const currentSecondayCard = createCurrentSecondayCard();
    elements.currentCondMain.appendChild(currentCondCard);
    elements.currentCondSecondary.appendChild(currentSecondayCard);




    // Loop through next 5 days of the forecast
    for (let i=1; i<6; i++){
        const card = createForecastCard(weatherData.forecast[i]);
        elements.sevenDayForecast.appendChild(card);
    }
}

function setBackground() {
    // Determine day or night
    const time = new Date('2025-01-01T'+weatherData.currentConditions.datetime);
    const sunrise = new Date('2025-01-01T'+weatherData.currentConditions.sunrise);
    const sunset = new Date('2025-01-01T'+weatherData.currentConditions.sunset);
    let timeOfDay = '';

    if (time < sunrise || time > sunset) {
        timeOfDay = 'night';
        elements.body.classList.remove('day');
        elements.body.classList.add('night');
    } else {
        timeOfDay = 'day';
        elements.body.classList.remove('night');
        elements.body.classList.add('day');
    }

    // Determine weather conditions
    let bgType = weatherData.background;
    const bgTypeArray = bgType.toLowerCase().split(',')[0].split(' ');
    let bgClassName = '';

    bgTypeArray.forEach((el) => {
        bgClassName = bgClassName+el+'-';
    })

    
    bgClassName = `var(--${bgClassName+timeOfDay})`;
    elements.body.style.setProperty('--bg', bgClassName);

}

function createCurrentSecondayCard() {
    const card = createElem('div', 'current-secondary-card');
    const feelsLike = createElem('div', 'feels-like');
    const humidity = createElem('div', 'humidity');
    const chancePrecip = createElem('div', 'chance-precip');
    const uvIndex = createElem('div', 'uv-index');

    feelsLike.innerHTML = '<span>Feels Like: </span>'+Math.round(weatherData.currentConditions.feelslike)+'°';
    humidity.innerHTML = '<span>Humidity: </span>'+Math.round(weatherData.currentConditions.humidity)+'%';
    chancePrecip.innerHTML = '<span>Chance of Precipitation: </span>'+Math.round(weatherData.currentConditions.precipprob)+'%';
    uvIndex.innerHTML = '<span>UV Index: </span>'+Math.round(weatherData.currentConditions.uvindex);
    
    card.appendChild(feelsLike);
    card.appendChild(humidity);
    card.appendChild(chancePrecip);
    card.appendChild(uvIndex);

    return card;
}

function createCurrentCondCard() {
    const card = createElem('div', 'current-card');
    const icon = createIcon(weatherData.currentConditions.icon);
    const temp = createElem('div', 'current-temp');
    const conditions = createElem('div', 'current-conditions');

    temp.innerText = Math.round(weatherData.currentConditions.temp)+'°';
    conditions.innerText = weatherData.currentConditions.conditions;

    card.appendChild(icon);
    card.appendChild(temp);
    card.appendChild(conditions);

    return card;
}

function createForecastCard(data) {
    const card = createElem('div', 'forecast-card');
    const day = createElem('div', 'forecast-day');
    const temp = createElem('div', 'forecast-temp');
    const iconCont = createElem('div', 'forecast-icon');
    const icon = createIcon(data.icon);
    const conditions = createElem('div', 'forecast-conditions');

    let weekday = getWeekDay(data.datetime);
    day.innerText = weekday;
    temp.innerText = Math.round(data.temp)+'°';
    conditions.innerText = data.conditions;

    iconCont.appendChild(icon);
    card.appendChild(day);
    card.appendChild(iconCont);
    card.appendChild(temp);
    card.appendChild(conditions);
    
    return card;
}

function createElem(type, ...classes) {
    const elem = document.createElement(type);
    if (classes) {
        classes.forEach((cssClass) => {
            elem.classList.add(cssClass);
        });
    }
    return elem;
}




elements.searchCont.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        weatherQuery.location = elements.searchInput.value.toString();
        displayLoader();
        requestData();
    }
})

elements.untisToggle.addEventListener('click', (e) => {
    if (e.target.checked === true) {
        weatherQuery.units = 'us';
    } else {
        weatherQuery.units = 'metric';
    }
    displayLoader();
    requestData();
    
})

/* GeoLocation */
async function getGeoLocation() {
    if ("geolocation" in navigator) {
        displayLoader();
        const location = await navigator.geolocation.getCurrentPosition((position) => {
             weatherQuery.lat = position.coords.latitude;
             weatherQuery.lng = position.coords.longitude;
             reverseGeocode();
        });
    } else {
        return null;
    }
      
}

async function reverseGeocode() {
    const apiKey = 'EYUEBegUWE8HeKPoc2QXeeK7AkWTv5mi';
    try {
        const response = await fetch(`https://api.geocodify.com/v2/reverse?api_key=${apiKey}&lat=${weatherQuery.lat}&lng=${weatherQuery.lng}`, {mode: 'cors'});
        if (response.status === 200) {
            const responseData = await response.json();
            const locality = responseData.response.features[0].properties.locality;
            const region = responseData.response.features[0].properties.region;
            const country = responseData.response.features[0].properties.country;
            const locationName = `${locality}, ${region}, ${country}`;
            weatherQuery.location = locationName;
            requestData();
        }
    } catch(error) {
        console.error(error);
    }

}

// Try getting geo location
getGeoLocation();