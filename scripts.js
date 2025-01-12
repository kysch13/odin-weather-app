const elements = (function() {
    const searchCont = document.getElementById('search-cont');
    const searchInput = document.getElementById('search-bar');
    const forecastBox = document.getElementById('forecast-box');
    const untisToggle = document.getElementById('units-toggle');
    const sevenDayForecast = document.getElementById('sevenday-forecast-card-cont');
    const currentWeatherCard = document.getElementById('current-weather-card');
    const locationHeader = document.querySelector('.location-header h2');
    return {searchCont, searchInput, forecastBox, untisToggle, sevenDayForecast, currentWeatherCard, locationHeader}
})();

const createIcon = function (icon) {
    const img = document.createElement('img');
    img.alt = icon;
    img.src = `./img/icons/${icon}.png`;
    return img;
}

const weatherQuery = {
    location: 'London, Ontario',
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
            console.log(responseData);
            populateDashboard();
        }
        if (response.status === 400) {
            console.log('No such location found');
        }
    } catch (error) {
        console.error(error);
    }
}

function getWeekDay(date) {
    let day = new Date(date+'T00:00:00');
    return day.toLocaleDateString('en-US', { weekday: 'long' });
}

const populateDashboard = function() {
    // Clear Dashboard
    elements.sevenDayForecast.innerHTML = '';
    elements.locationHeader.innerHTML = '';

    elements.locationHeader.innerText = weatherData.location;
    /*
    document.querySelector('#search-cont > div').innerText = weatherData.location;
    document.querySelector('#search-cont > div').innerText += '\n'+weatherData.currentConditions.temp+'°';
    document.querySelector('#search-cont > div').innerText += '\n'+weatherData.description;
    document.querySelector('#search-cont > div').appendChild(createIcon(weatherData.currentConditions.icon));
    */

    // Loop through next 7 days of the forecast
    for (let i=1; i<8; i++){
        const card = createForecastCard(weatherData.forecast[i]);
        elements.sevenDayForecast.appendChild(card);
        /*
        let day = getWeekDay(weatherData.forecast[i].datetime);
        elements.forecastBox.innerText += '\n'+day;
        elements.forecastBox.appendChild(createIcon(weatherData.forecast[i].icon));
        elements.forecastBox.innerText += '\n'+weatherData.forecast[i].temp;
        elements.forecastBox.innerText += '\n'+weatherData.forecast[i].conditions;
        elements.forecastBox.innerText += '\n'+"-----------------";
        elements.forecastBox.appendChild(createIcon(weatherData.forecast[i].icon));
        */
    }
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
        requestData();
    }
})

elements.untisToggle.addEventListener('click', (e) => {
    if (e.target.checked === true) {
        weatherQuery.units = 'us';
    } else {
        weatherQuery.units = 'metric';
    }
    requestData();
    
})

