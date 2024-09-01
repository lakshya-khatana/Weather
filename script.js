const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

document.getElementById('search').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        fetchWeather(city);
    }
});

document.getElementById('search-history').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=256156d28a4575e841a3cce2fdfc060b&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                addToHistory(city);
                fetchForecast(city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeather(data) {
    const location = document.getElementById('location');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const weatherIcon = document.getElementById('weather-icon');

    location.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperature: ${data.main.temp} °C`;
    description.textContent = `Description: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherIcon.alt = data.weather[0].description;
}

function fetchForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';

    data.list.filter(item => item.dt_txt.includes('12:00:00')).forEach(item => {
        const day = document.createElement('div');
        day.className = 'day';
        day.innerHTML = `
            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            <p>${item.main.temp} °C</p>
            <p>${item.weather[0].description}</p>
        `;
        forecast.appendChild(day);
    });
}

function addToHistory(city) {
    const history = document.getElementById('search-history');
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    history.appendChild(historyItem);
}
