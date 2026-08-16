const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const errorMessage = document.getElementById("errorMessage");

const locationName = document.getElementById("locationName");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const uv = document.getElementById("uv");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const weatherState =
    document.getElementById("weatherState");

const weatherParticles =
    document.getElementById("weatherParticles");

const forecastContainer =
    document.getElementById("forecastContainer");

const dateDisplay =
    document.getElementById("dateDisplay");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const visibility =
    document.getElementById("visibility");

const airQuality =
    document.getElementById("airQuality");

const lastUpdated =
    document.getElementById("lastUpdated");


/* =====================================================
   WEATHER CODE MAPPING
===================================================== */

function getWeatherInfo(code) {

    if (code === 0) {
        return {
            type: "clear",
            description: "Clear skies",
            icon: "☀",
            state: "CLEAR / CALM"
        };
    }

    if ([1, 2].includes(code)) {
        return {
            type: "clear",
            description: "Partly cloudy",
            icon: "◐",
            state: "LIGHT CLOUD COVER"
        };
    }

    if (code === 3) {
        return {
            type: "cloudy",
            description: "Overcast",
            icon: "☁",
            state: "OVERCAST"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            type: "fog",
            description: "Foggy conditions",
            icon: "≋",
            state: "LOW VISIBILITY"
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            type: "rain",
            description: "Drizzle",
            icon: "☂",
            state: "LIGHT PRECIPITATION"
        };
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return {
            type: "rain",
            description: "Rain showers",
            icon: "☂",
            state: "RAIN IN PROGRESS"
        };
    }

    if ([71, 73, 75, 77].includes(code)) {
        return {
            type: "snow",
            description: "Snowfall",
            icon: "❄",
            state: "SNOW CONDITIONS"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            type: "rain",
            description: "Rain showers",
            icon: "☂",
            state: "SHOWERS"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            type: "storm",
            description: "Thunderstorm",
            icon: "ϟ",
            state: "STORM ALERT"
        };
    }

    return {
        type: "cloudy",
        description: "Changing conditions",
        icon: "☁",
        state: "CHANGING CONDITIONS"
    };
}


/* =====================================================
   WEATHER PARTICLES
===================================================== */

function createWeatherParticles(type) {

    weatherParticles.innerHTML = "";

    if (type === "rain") {

        for (let i = 0; i < 90; i++) {

            const drop = document.createElement("div");

            drop.className = "particle raindrop";

            drop.style.left =
                Math.random() * 100 + "%";

            drop.style.animationDelay =
                Math.random() * 2 + "s";

            drop.style.animationDuration =
                0.4 + Math.random() * 0.6 + "s";

            weatherParticles.appendChild(drop);
        }
    }


    if (type === "snow") {

        for (let i = 0; i < 60; i++) {

            const snow = document.createElement("div");

            snow.className = "particle snowflake";

            snow.style.left =
                Math.random() * 100 + "%";

            snow.style.animationDelay =
                Math.random() * 6 + "s";

            snow.style.animationDuration =
                5 + Math.random() * 6 + "s";

            snow.style.width =
                3 + Math.random() * 5 + "px";

            snow.style.height =
                snow.style.width;

            weatherParticles.appendChild(snow);
        }
    }


    if (type === "clear") {

        const sun = document.createElement("div");

        sun.className = "sun-ray";

        weatherParticles.appendChild(sun);
    }


    if (type === "storm") {

        for (let i = 0; i < 35; i++) {

            const drop = document.createElement("div");

            drop.className = "particle raindrop";

            drop.style.left =
                Math.random() * 100 + "%";

            drop.style.animationDelay =
                Math.random() * 2 + "s";

            weatherParticles.appendChild(drop);
        }
    }
}


/* =====================================================
   THEME
===================================================== */

function applyWeatherTheme(info) {

    document.body.className =
        `weather-${info.type}`;

    weatherDescription.textContent =
        info.description;

    weatherIcon.textContent =
        info.icon;

    weatherState.textContent =
        info.state;

    createWeatherParticles(info.type);
}


/* =====================================================
   DATE
===================================================== */

function updateDate() {

    const now = new Date();

    dateDisplay.textContent =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


/* =====================================================
   SEARCH CITY
===================================================== */

async function searchCity(city) {

    if (!city.trim()) return;

    showLoading();

    try {

        const geoResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );

        const geoData =
            await geoResponse.json();

        if (!geoData.results ||
            geoData.results.length === 0) {

            throw new Error(
                "City not found. Try another location."
            );
        }

        const place =
            geoData.results[0];

        await getWeather(
            place.latitude,
            place.longitude,
            place.name,
            place.country
        );

    } catch (error) {

        showError(error.message);

    }
}


/* =====================================================
   GET WEATHER
===================================================== */

async function getWeather(
    latitude,
    longitude,
    city,
    country = ""
) {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,pressure_msl,wind_speed_10m` +
            `&hourly=visibility,uv_index` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
            `&timezone=auto&forecast_days=6`;

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Weather service unavailable.");
        }

        const data =
            await response.json();

        updateInterface(
            data,
            city,
            country
        );

    } catch (error) {

        showError(
            "Unable to load weather data."
        );

        console.error(error);
    }
}


/* =====================================================
   UPDATE UI
===================================================== */

function updateInterface(
    data,
    city,
    country
) {

    const current =
        data.current;

    const info =
        getWeatherInfo(
            current.weather_code
        );


    locationName.textContent =
        country
            ? `${city}, ${country}`
            : city;


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    pressure.textContent =
        `${Math.round(
            current.pressure_msl
        )} hPa`;


    if (data.hourly &&
        data.hourly.uv_index) {

        const maxUV =
            Math.max(
                ...data.hourly.uv_index
                    .slice(0, 24)
            );

        uv.textContent =
            maxUV.toFixed(1);
    }


    if (data.hourly &&
        data.hourly.visibility) {

        const visibilityKm =
            data.hourly.visibility[0] / 1000;

        visibility.textContent =
            `${visibilityKm.toFixed(1)} km`;

        updateVisibilityText(
            visibilityKm
        );
    }


    if (data.daily) {

        sunrise.textContent =
            formatTime(
                data.daily.sunrise[0]
            );

        sunset.textContent =
            formatTime(
                data.daily.sunset[0]
            );
    }


    applyWeatherTheme(info);

    generateForecast(
        data.daily
    );

    updateAirQuality(
        current.relative_humidity_2m,
        current.wind_speed_10m
    );


    lastUpdated.textContent =
        `Updated ${new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )}`;


    hideError();
}


/* =====================================================
   FORECAST
===================================================== */

function generateForecast(daily) {

    forecastContainer.innerHTML = "";

    for (
        let i = 1;
        i < Math.min(6, daily.time.length);
        i++
    ) {

        const info =
            getWeatherInfo(
                daily.weather_code[i]
            );

        const date =
            new Date(
                daily.time[i]
            );

        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const card =
            document.createElement("div");

        card.className =
            "forecast-card";

        card.innerHTML = `

            <div class="forecast-day">
                ${day.toUpperCase()}
            </div>

            <span
                class="forecast-icon"
            >
                ${info.icon}
            </span>

            <div>
                <span class="forecast-temp">
                    ${Math.round(
                        daily.temperature_2m_max[i]
                    )}°
                </span>

                <span class="forecast-low">
                    ${Math.round(
                        daily.temperature_2m_min[i]
                    )}°
                </span>
            </div>

            <div class="forecast-description">
                ${info.description}
            </div>

        `;

        forecastContainer.appendChild(card);
    }
}


/* =====================================================
   VISIBILITY
===================================================== */

function updateVisibilityText(value) {

    const text =
        document.querySelector(
            ".visibility-card p"
        );

    if (value >= 10) {
        text.textContent =
            "Excellent visibility";
    } else if (value >= 5) {
        text.textContent =
            "Good visibility";
    } else {
        text.textContent =
            "Reduced visibility";
    }
}


/* =====================================================
   AIR QUALITY ESTIMATE
===================================================== */

function updateAirQuality(
    humidityValue,
    windValue
) {

    let quality = "Good";

    if (
        humidityValue > 85 &&
        windValue < 5
    ) {
        quality = "Moderate";
    }

    if (
        humidityValue > 90 &&
        windValue < 3
    ) {
        quality = "Poor";
    }

    airQuality.textContent =
        quality;

    const meter =
        document.querySelector(
            ".air-meter div"
        );

    if (quality === "Good") {
        meter.style.width = "75%";
    } else if (quality === "Moderate") {
        meter.style.width = "50%";
    } else {
        meter.style.width = "30%";
    }
}


/* =====================================================
   TIME
===================================================== */

function formatTime(value) {

    if (!value) return "--";

    const date =
        new Date(value);

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =====================================================
   LOCATION
===================================================== */

function useMyLocation() {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;
    }

    locationBtn.textContent =
        "Detecting location...";

    navigator.geolocation.getCurrentPosition(

        async position => {

            const {
                latitude,
                longitude
            } = position.coords;

            try {

                const geoResponse =
                    await fetch(
                        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
                    );

                const geoData =
                    await geoResponse.json();

                let city = "Your Location";
                let country = "";

                if (
                    geoData.results &&
                    geoData.results.length
                ) {

                    city =
                        geoData.results[0].name;

                    country =
                        geoData.results[0].country;
                }

                await getWeather(
                    latitude,
                    longitude,
                    city,
                    country
                );

            } catch {

                await getWeather(
                    latitude,
                    longitude,
                    "Your Location"
                );
            }

            locationBtn.innerHTML =
                "<span>◎</span> Use my location";
        },

        () => {

            showError(
                "Location access was denied. Search for your city instead."
            );

            locationBtn.innerHTML =
                "<span>◎</span> Use my location";
        }
    );
}


/* =====================================================
   UI HELPERS
===================================================== */

function showLoading() {

    searchBtn.textContent =
        "LOADING...";

    searchBtn.disabled = true;
}

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

    searchBtn.textContent =
        "SEARCH";

    searchBtn.disabled =
        false;
}

function hideError() {

    errorMessage.style.display =
        "none";

    searchBtn.textContent =
        "SEARCH";

    searchBtn.disabled =
        false;
}


/* =====================================================
   EVENTS
===================================================== */

searchBtn.addEventListener(
    "click",
    () => {
        searchCity(
            cityInput.value
        );
    }
);


cityInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchCity(
                cityInput.value
            );
        }
    }
);


locationBtn.addEventListener(
    "click",
    useMyLocation
);


/* =====================================================
   INITIAL LOAD
===================================================== */

updateDate();

getWeather(
    28.6139,
    77.2090,
    "New Delhi",
    "India"
);