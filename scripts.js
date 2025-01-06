const weatherQuery = {
    location: 'London, Ontario',
    units: 'metric',

}

const weatherData = {
    currentConditions: {},
}

const requestData = async function() {
    const apiKey = 'ZQKWB8FWZ8XLGKDY8G3XZ573J';
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${weatherQuery.location}?key=${apiKey}&unitGroup=${weatherQuery.units}`, {mode: 'cors'});
        const responseData = await response.json();
        weatherData.currentConditions = responseData.currentConditions;
        weatherData.description = responseData.description;
        weatherData.forecast = responseData.days;
        populateDashboard();
    } catch (error) {
        console.error(error);
    }
}

const populateDashboard = function() {
    document.querySelector('body').innerText = weatherData.currentConditions.temp;
    document.querySelector('body').innerText += '\n'+weatherData.description;
    document.querySelector('body').innerText += '\n'+weatherData.currentConditions.icon;
}

requestData();