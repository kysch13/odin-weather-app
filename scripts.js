const elements = (function() {
    const searchCont = document.getElementById('search-cont');
    const searchInput = document.getElementById('search-bar');
    const forecastBox = document.getElementById('forecast-box');
    return {searchCont, searchInput, forecastBox}
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

const populateDashboard = function() {
    document.querySelector('#search-cont > div').innerText = weatherData.location;
    document.querySelector('#search-cont > div').innerText += '\n'+weatherData.currentConditions.temp+'°';
    document.querySelector('#search-cont > div').innerText += '\n'+weatherData.description;
    document.querySelector('#search-cont > div').appendChild(createIcon(weatherData.currentConditions.icon));


    // Loop through next 7 days of the forecast
    for (let i=1; i<8; i++){
        elements.forecastBox.innerText += '\n'+weatherData.forecast[i].datetime;
        elements.forecastBox.appendChild(createIcon(weatherData.forecast[i].icon));
        elements.forecastBox.innerText += '\n'+weatherData.forecast[i].temp;
        elements.forecastBox.innerText += '\n'+weatherData.forecast[i].conditions;
        elements.forecastBox.innerText += '\n'+"-----------------";
        elements.forecastBox.appendChild(createIcon(weatherData.forecast[i].icon));
    }
}

elements.searchCont.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        weatherQuery.location = elements.searchInput.value.toString();
        requestData();
    }
})

