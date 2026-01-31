/**
 * Weather App - Main Script
 * Fetches live weather from OpenWeatherMap API using fetch and async/await.
 * Handles loading state, errors, and displays temperature, condition, humidity, wind speed, and icon.
 */

/* ============================================
   CONFIGURATION
   Get your free API key at: https://openweathermap.org/api
   ============================================ */
const API_KEY = 'YOUR API HERE'; // Replace with your key
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';
const ICON_BASE = 'https://openweathermap.org/img/wn/';

/* ============================================
   DOM ELEMENTS
   ============================================ */
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const errorMsg = document.getElementById('error-msg');
const loadingSection = document.getElementById('loading-section');
const weatherSection = document.getElementById('weather-section');
const promptSection = document.getElementById('prompt-section');

const cityNameEl = document.getElementById('city-name');
const weatherDateEl = document.getElementById('weather-date');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const weatherConditionEl = document.getElementById('weather-condition');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

/* ============================================
   STATE HELPERS
   Show/hide sections and clear error
   ============================================ */

/** Hides loading spinner and shows weather or prompt. */
function hideLoading() {
  loadingSection.classList.add('hidden');
}

/** Shows loading spinner and hides weather card and prompt. */
function showLoading() {
  promptSection.classList.add('hidden');
  weatherSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');
}

/** Shows weather card and hides prompt. */
function showWeather() {
  promptSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
  weatherSection.classList.remove('hidden');
}

/** Shows initial prompt when no search has been made yet. */
function showPrompt() {
  weatherSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
  promptSection.classList.remove('hidden');
}

/** Displays a user-friendly error message and clears it when empty. */
function setError(message) {
  errorMsg.textContent = message || '';
  errorMsg.style.display = message ? 'flex' : 'none';
}

/** Clears the error message. */
function clearError() {
  setError('');
}

/* ============================================
   API: FETCH WEATHER BY CITY
   Uses fetch with async/await
   ============================================ */

/**
 * Fetches current weather for a city from OpenWeatherMap API.
 * @param {string} city - City name to search (e.g. "London", "Tokyo")
 * @returns {Promise<Object>} - Weather data object or throws on error
 */
async function fetchWeatherByCity(city) {
  const url = `${API_BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please add your OpenWeatherMap API key in script.js.');
    }
    throw new Error('Unable to fetch weather. Please try again later.');
  }

  const data = await response.json();
  return data;
}

/* ============================================
   RENDER WEATHER DATA
   Fills the weather card with API response
   ============================================ */

/**
 * Formats a Date to a readable string (e.g. "Friday, 30 Jan 2025").
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

/**
 * Renders the weather object into the DOM.
 * @param {Object} data - OpenWeatherMap API response
 */
function renderWeather(data) {
  const { name, main, weather, wind, dt } = data;
  const condition = weather[0];
  const iconCode = condition.icon;
  const iconUrl = `${ICON_BASE}${iconCode}@2x.png`;

  cityNameEl.textContent = name;
  weatherDateEl.textContent = formatDate(new Date(dt * 1000));
  weatherIconEl.src = iconUrl;
  weatherIconEl.alt = condition.description;
  temperatureEl.textContent = Math.round(main.temp);
  weatherConditionEl.textContent = condition.description;
  humidityEl.textContent = `${main.humidity}%`;
  windSpeedEl.textContent = `${Math.round(wind.speed)} m/s`;

  showWeather();
}

/* ============================================
   SEARCH HANDLER
   Validates input, shows loading, fetches, renders or shows error
   ============================================ */

/**
 * Handles search: validates city name, fetches weather, updates UI.
 */
async function handleSearch() {
  const city = searchInput.value.trim();
  clearError();

  if (!city) {
    setError('Please enter a city name.');
    return;
  }

  showLoading();

  try {
    const data = await fetchWeatherByCity(city);
    renderWeather(data);
  } catch (err) {
    hideLoading();
    showPrompt();
    setError(err.message || 'Something went wrong. Please try again.');
  }
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

// Search on button click
searchBtn.addEventListener('click', handleSearch);

// Search on Enter key in input
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Clear error when user starts typing again
searchInput.addEventListener('input', () => {
  if (errorMsg.textContent) clearError();
});

/* ============================================
   INIT
   Ensure prompt is visible on first load
   ============================================ */
showPrompt();

