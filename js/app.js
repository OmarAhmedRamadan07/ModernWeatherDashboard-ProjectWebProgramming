/*
 * =========================================================
 * Modern Weather Dashboard - Core JavaScript Logic
 * Project: SUT 2026 
 * Description: I designed this architecture to handle external API
 * requests (OpenWeatherMap & Nominatim), manage the DOM state, 
 * integrate Leaflet.js maps, and sync with our PHP backend.

 * =========================================================
 */

// =========================================================
// 1. Configuration & Global Variables
// =========================================================
const API_KEY = 'dc6995fce2cbfe9781f339cb5d7a2288';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// I initialized the Leaflet map variables globally so we can update them later without re-instantiating the map
let map;
let marker;


// =========================================================
// 2. UI & Theming Helper Functions
// =========================================================

/*
 * I created this function to map standard API weather conditions 
 * to our custom, high-quality local images. This gives our dashboard a premium feel.
 */
function getWeatherIcon(condition) {
    const desc = condition.toLowerCase();
    const path = "images/"; 

    if (desc.includes("clear")) return `${path}clear.png`;
    if (desc.includes("few clouds")) return `${path}Few-clouds.png`;
    if (desc.includes("scattered clouds")) return `${path}Scattered-clouds.png`;
    if (desc.includes("broken clouds")) return `${path}Broken-clouds.png`;
    if (desc.includes("overcast clouds")) return `${path}Overcast-clouds.png`;
    if (desc.includes("light rain")) return `${path}Light-rain.png`;
    if (desc.includes("moderate rain")) return `${path}Moderate-rain.png`;
    if (desc.includes("heavy intensity rain")) return `${path}Heavy-intensity-rain.png`;
    if (desc.includes("thunderstorm with rain")) return `${path}Thunderstorm-with-rain.png`;
    if (desc.includes("thunderstorm")) return `${path}Thunderstorm.png`;
    if (desc.includes("light snow")) return `${path}Light-snow.png`;
    if (desc.includes("heavy snow")) return `${path}Heavy-snow.png`;
    if (desc.includes("drizzle")) return `${path}Drizzle.png`;
    if (desc.includes("mist")) return `${path}Mist.png`;
    if (desc.includes("fog")) return `${path}Fog.png`;
    if (desc.includes("haze")) return `${path}haze.png`;
    if (desc.includes("dust")) return `${path}Dust.png`;
    if (desc.includes("sand")) return `${path}Sand.png`;
    if (desc.includes("smoke")) return `${path}Smoke.png`;

    return `${path}icon.png`; // Fallback icon
}

/*
 * I wrote this logic to dynamically switch the entire body background 
 * based on real-time weather conditions.
 */
const updateBackground = (condition) => {
    const desc = condition.toLowerCase();
    const body = document.body;

    // Resetting previous classes before applying a new one
    body.classList.remove('bg-clear', 'bg-clouds', 'bg-rain', 'bg-thunderstorm', 'bg-snow', 'bg-mist');

    if (desc.includes("clear")) {
        body.classList.add('bg-clear');
    } else if (desc.includes("cloud") || desc.includes("overcast")) {
        body.classList.add('bg-clouds');
    } else if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("squall")) {
        body.classList.add('bg-rain');
    } else if (desc.includes("thunderstorm") || desc.includes("tornado")) {
        body.classList.add('bg-thunderstorm'); 
    } else if (desc.includes("snow") || desc.includes("sleet")) {
        body.classList.add('bg-snow');
    } else if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze") || desc.includes("dust") || desc.includes("sand") || desc.includes("smoke") || desc.includes("ash")) {
        body.classList.add('bg-mist'); 
    } else {
        body.classList.add('bg-clouds'); 
    }
};


// =========================================================
// 3. Map & Geolocation Features
// =========================================================

/*
 * I integrated Leaflet.js here. I also implemented a "Click to Explore" feature 
 * utilizing OpenStreetMap's Nominatim API for hyper-local reverse geocoding, 
 * bypassing OpenWeatherMap's generic city limitations.
 */
const updateMap = (lat, lon, temp, city) => {
    if (!map) {
        // Initialize map on first load
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Listening for user clicks to fetch hyper-local data
        map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            
            if(typeof Swal !== 'undefined') Swal.showLoading();

            try {
                // Fetching precise village/street name using Reverse Geocoding
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`);
                const geoData = await geoRes.json();

                // I prioritize smaller geographic entities (like villages/neighborhoods) over large cities
                const preciseLocation = geoData.address.village || 
                                        geoData.address.suburb || 
                                        geoData.address.neighbourhood || 
                                        geoData.address.hamlet || 
                                        geoData.address.city_district || 
                                        geoData.name || "منطقة غير معروفة";

                // Fetching weather data specifically for these exact coordinates
                const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`);
                const weatherData = await weatherRes.json();
                
                const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`);
                const forecastData = await forecastRes.json();

                if (weatherData && forecastData) {
                    // Injecting our precise location name before passing it to Omar's DOM functions
                    weatherData.name = preciseLocation; 

                    displayCurrentWeather(weatherData);
                    displayForecast(forecastData);
                    saveCityToHistory(preciseLocation);
                }
                
                if(typeof Swal !== 'undefined') Swal.close();
            } catch (err) {
                console.error("Map Click Event Error: ", err);
                if(typeof Swal !== 'undefined') Swal.fire({ icon: 'error', title: 'Oops...', text: 'Could not fetch weather for this specific spot.' });
            }
        });
    } else {
        // Smooth flying animation if the map is already loaded
        map.flyTo([lat, lon], 10, {
            animate: true,
            duration: 1.5 
        });
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong style="color:#0284c7;">${city}</strong><br>Temp: ${Math.round(temp)}°C`)
        .openPopup();
};

/*
 * Auto-detect user's location on startup using the browser's Geolocation API.
 * I also attached the Nominatim reverse-geocoding here for better accuracy.
 */
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=ar`);
                const geoData = await geoRes.json();
                const preciseLocation = geoData.address.village || geoData.address.suburb || geoData.address.neighbourhood || geoData.name;

                const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
                const data = await response.json();
                
                if (data) {
                    data.name = preciseLocation; 
                    displayCurrentWeather(data);
                    saveCityToHistory(preciseLocation); // Sync with Shimaa's DB
                }
            } catch (error) {
                console.warn("Could not fetch hyper-local address on load.");
            }
        });
    }
};


// =========================================================
// 4. Core Weather Fetching Logic
// =========================================================

/*
 * I used Promise.all here to fetch both current weather and the 5-day forecast concurrently.
 * This significantly reduces the loading time for the user.
 */
const fetchWeatherData = async (city) => {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            // I integrated SweetAlert2 for a modern error popup instead of the ugly default alert
            if(typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'City not found. Please check the spelling!',
                    confirmButtonColor: '#38bdf8',
                    background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
                    color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
                });
            } else {
                alert("City not found. Please check the spelling.");
            }
            return false;
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        return true; 
    } catch (error) {
        console.error("JavaScript Execution Error:", error);
        return false;
    }
};


// =========================================================
// 5. DOM Manipulation & Display Methods
// =========================================================

const displayCurrentWeather = (data) => {
    updateBackground(data.weather[0].description);
    
    const weatherSection = document.getElementById('current-weather');
    const iconUrl = getWeatherIcon(data.weather[0]?.description || '');
    
    // I added Intl.DisplayNames to translate standard country codes into full names dynamically
    let fullCountryName = data.sys.country;
    try {
        const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
        fullCountryName = regionNames.of(data.sys.country);
    } catch (e) {
        console.warn("Could not translate country code.");
    }
    
    weatherSection.innerHTML = `
        <div class="current-weather-card">
            <h2>${data.name}, ${fullCountryName}</h2>
            <div class="weather-info">
                <img src="${iconUrl}" alt="${data.weather[0]?.description || 'weather'}">
                <div class="details">
                    <p class="temp">${Math.round(data.main.temp)}°C</p>
                    <p class="desc" style="text-transform: capitalize;">${data.weather[0]?.description || ''}</p>
                </div>
            </div>
        </div>
    `;

    updateMap(data.coord.lat, data.coord.lon, data.main.temp, data.name);

    // AI-like Smart Advice System based on weather metrics
    let advice = "";
    let adviceIcon = "info";

    if (data.weather[0].main.toLowerCase() === "rain" || data.weather[0].main.toLowerCase() === "drizzle") {
        advice = "It's raining! Don't forget your umbrella ☂️";
        adviceIcon = "warning";
    } else if (data.main.temp > 30) {
        advice = "It's quite hot! Stay hydrated and drink plenty of water 💧";
        adviceIcon = "warning";
    } else if (data.main.temp < 15) {
        advice = "It's cold out there! Wear something heavy 🧥";
        adviceIcon = "info";
    } else {
        advice = "The weather is great! Have a wonderful day 🌟";
        adviceIcon = "success";
    }

    // Triggering the Smart Advice Toast
    if(typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
            color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
        });

        Toast.fire({
            icon: adviceIcon,
            title: `${data.name} Weather`,
            text: advice
        });
    }
};

/*
 * OpenWeatherMap returns 40 timestamps (every 3 hours for 5 days). 
 * I wrote an aggregator logic to filter this into a clean 5-day array showing daily Min/Max temps.
 */
const displayForecast = (data) => {
    const forecastContainer = document.getElementById('forecast-cards');
    const forecastSection = document.querySelector('.forecast-section');
    if (!forecastContainer) return; 

    forecastContainer.innerHTML = ''; 

    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0]; 
        
        if (!dailyForecasts[dateStr]) {
            dailyForecasts[dateStr] = {
                dt: item.dt,
                weather: item.weather, 
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min
            };
        } else {
            if (item.main.temp_max > dailyForecasts[dateStr].temp_max) {
                dailyForecasts[dateStr].temp_max = item.main.temp_max;
            }
            if (item.main.temp_min < dailyForecasts[dateStr].temp_min) {
                dailyForecasts[dateStr].temp_min = item.main.temp_min;
            }
            if (item.dt_txt.includes("12:00:00")) {
                dailyForecasts[dateStr].weather = item.weather;
            }
        }
    });

    const dailyData = Object.values(dailyForecasts).slice(0, 5);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = getWeatherIcon(day.weather[0]?.description || '');
        
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
            <h4>${date}</h4>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 15px 0;">
                <img src="${iconUrl}" alt="Weather Icon" style="width: 50px; height: auto;">
                <span style="font-size: 0.9rem; text-transform: capitalize; color: var(--text-dim); text-align: left;">
                    ${day.weather[0]?.description || 'Unknown'}
                </span>
            </div>
            <p><strong>${Math.round(day.temp_max)}°</strong> / ${Math.round(day.temp_min)}°</p>
        `;
        forecastContainer.appendChild(card);
    });

    renderForecastTable(dailyData, forecastSection || forecastContainer.parentElement);
};

const renderForecastTable = (dailyData, container) => {
    if (!container) return; 

    const oldTable = container.querySelector('.forecast-table');
    if (oldTable) oldTable.remove();

    const table = document.createElement('table');
    table.className = 'forecast-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Day</th>
                <th>Date</th>
                <th>Icon</th>
                <th>Condition</th>
                <th>High</th>
                <th>Low</th>
            </tr>
        </thead>
        <tbody>
            ${dailyData.map(day => {
                const iconUrl = getWeatherIcon(day.weather[0]?.description || '');
                const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                const fullDate = new Date(day.dt * 1000).toLocaleDateString();

                return `
                <tr>
                    <td style="font-weight: bold; color: var(--accent-color);">${dayName}</td>
                    <td>${fullDate}</td>
                    <td>
                        <img src="${iconUrl}" alt="Icon" style="width: 40px; height: auto; filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.4));">
                    </td>
                    <td style="text-transform: capitalize;">${day.weather[0]?.description || 'N/A'}</td>
                    <td>${Math.round(day.temp_max)}°C</td>
                    <td>${Math.round(day.temp_min)}°C</td>
                </tr>
                `;
            }).join('')}
        </tbody>
    `;
    container.appendChild(table);
};


// =========================================================
// 6. Backend Integration & Database Sync
// =========================================================

/*
 * This function triggers Shimaa's PHP script to save the search history.
 */
const saveCityToHistory = async (city) => {
    try {
        const response = await fetch('api/save_city.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `city=${encodeURIComponent(city)}`
        });
        
        if (response.ok) {
            await updateSidebar(); // Auto-refresh the sidebar upon successful save
        }
    } catch (err) {
        console.warn("Database Error: Could not save to history.");
    }
};

/*
 * Fetches the latest searches to dynamically update the UI sidebar.
 */
const updateSidebar = async () => {
    try {
        const response = await fetch('api/get_history.php');
        if (!response.ok) return;
        
        const history = await response.json();
        const sidebarContainer = document.getElementById('saved-cities');
        
        if (sidebarContainer) {
            if (history.length === 0) {
                sidebarContainer.innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem; padding: 10px;">No recent searches</p>';
                return;
            }

            sidebarContainer.innerHTML = history.map(item => `
                <div class="saved-city" onclick="fetchWeatherData('${item.city_name}'); saveCityToHistory('${item.city_name}');">
                    ${item.city_name}
                </div>
            `).join('');
        }
    } catch (error) {
        console.warn("UI Error: Could not refresh sidebar. Check PHP connection.");
    }
};


// =========================================================
// 7. Event Listeners & Application Initialization
// =========================================================

// Handling user search input
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    
    if (city) {
        const isSuccess = await fetchWeatherData(city);
        if (isSuccess) {
            await saveCityToHistory(city); 
        }
        cityInput.value = ''; // Clear input field after search
    }
});

// Setting up Dark/Light Mode Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Persisting user theme preference via LocalStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '🌙 Dark Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '🌙 Dark Mode';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️ Light Mode';
    }
});

// Firing up essential functions when the application first loads
window.onload = () => {
    updateSidebar();
    getUserLocation(); 
};