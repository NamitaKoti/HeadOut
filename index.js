let currentWeather = null;

// ... (previous code)

function clearPreviousRecommendations() {
    const previousRecommendations = document.querySelector("#attire-recommendations");
    if (previousRecommendations) {
        previousRecommendations.remove();
    }
}

function renderWeather(weather) {
    clearPreviousWeather(); // Remove previous weather data

    if (currentWeather) {
        currentWeather.remove(); // Remove previous weather data
    }

    currentWeather = document.createElement("div");
    currentWeather.setAttribute("id", "weather-data");

    var resultsContainer = document.querySelector("#weather-results");
    resultsContainer.appendChild(currentWeather);

    // Create h2 for city name
    var city = document.createElement("h2");
    city.textContent = weather.name;
    currentWeather.appendChild(city);

    // Create p for temperature
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + weather.main.temp + "°F";
    currentWeather.appendChild(temp);

    // Create p for humidity
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + weather.main.humidity + "%";
    currentWeather.appendChild(humidity);

    // Create p for wind
    var wind = document.createElement("p");
    wind.textContent = "Wind: " + weather.wind.speed + "mph, " + weather.wind.deg + "°";
    currentWeather.appendChild(wind);

    // Create p for weather description
    var weatherDetails = weather.weather[0];
    if (weatherDetails && weatherDetails.description) {
        var description = document.createElement("p");
        description.textContent = weatherDetails.description;
        currentWeather.appendChild(description);
    }

    clearPreviousRecommendations(); // Remove previous attire recommendations

    // Display attire recommendations
    displayAttireRecommendations(weather);
}

// ... (remaining code)


function clearPreviousWeather() {
    if (currentWeather) {
        currentWeather.remove();
    }
}

function fetchWeather(query) {
    // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
    var apiKey = '5be7d35ec5e6f6de0ce43aba2efec93b';

    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey;
    return fetch(url)
        .then((response) => response.json());
}

const attireRecommendations = {
    "Hot and Sunny": ["Shorts", "T-shirt", "Sunglasses", "Sunscreen"],
    "Cold and Rainy": ["Raincoat", "Umbrella", "Boots", "Warm layers"],
    "Windy": ["Windbreaker", "Hat", "Gloves"],
    "Overcast clouds": ["Snow boots", "Winter jacket", "Snow pants", "Gloves"],
    "Scattered Clouds": ["Light jacket", "Hat", "Sunglasses"],
};

function getAttireRecommendations(weather) {
    let category;

    if (weather.main.temp > 80 && weather.weather[0].description.includes("clear")) {
        category = "Hot and Sunny";
    } else if (weather.main.temp < 50 && weather.weather[0].description.includes("rain")) {
        category = "Cold and Rainy";
    } else if (weather.wind.speed > 10) {
        category = "Windy";
    } else if (weather.weather[0].description.includes("snow")) {
        category = "Snowy";
    } else if (weather.weather[0].description.includes("clouds")) {
        category = "Scattered Clouds";
    }

    return attireRecommendations[category] || ["No recommendations available"];
}

function displayAttireRecommendations(weather) {
    clearPreviousRecommendations(); // Remove previous attire recommendations

    const recommendations = getAttireRecommendations(weather);
    const resultsContainer = document.querySelector("#weather-results");

    const attireList = document.createElement("ul");
    attireList.setAttribute("id", "attire-recommendations"); // Setting an ID for the recommendations list

    recommendations.forEach((item) => {
        const attireItem = document.createElement("li");
        attireItem.textContent = item;
        attireList.appendChild(attireItem);
    });

    resultsContainer.appendChild(attireList);
}

function fetchWeatherForUserLocation() {
    const locationInput = document.getElementById("location");
    const userLocation = locationInput.value;

    fetchWeather(userLocation)
        .then((weatherData) => renderWeather(weatherData));
}

const getLocationButton = document.getElementById("get-location-button");
getLocationButton.addEventListener("click", getUserLocation);

function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            showUserPosition,
            handleGeolocationError,
            { timeout: 10000 }
        );
    } else {
        alert("Geolocation is not available in your browser.");
    }
}

function showUserPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log("Latitude: " + latitude + ", Longitude: " + longitude);

    fetchWeatherByCoordinates(latitude, longitude);
}

function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Geolocation permission denied by user.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Geolocation information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("Geolocation request timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        default:
            alert("An error occurred while fetching your location.");
    }
}

function fetchWeatherByCoordinates(latitude, longitude) {
    const apiKey = '5be7d35ec5e6f6de0ce43aba2efec93b';
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    fetch(url)
        .then((response) => response.json())
        .then((weatherData) => renderWeather(weatherData))
        .catch((error) => console.error(error));
}

const fetchWeatherButton = document.getElementById("fetch-weather-button");
fetchWeatherButton.addEventListener("click", () => {
    clearPreviousWeather();
    fetchWeatherForUserLocation();
});

window.addEventListener("load", () => {
    document.querySelector("#search-box").style.display = "block";
});