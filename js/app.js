// ShoreSquad App JS
// Features to add: map interactivity, weather API, social features

document.addEventListener('DOMContentLoaded', () => {
  // --- Map Section ---
  if (window.L) {
    const map = L.map('map').setView([1.3521, 103.8198], 11); // Singapore default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    // Example marker
    L.marker([1.2801, 103.8500]).addTo(map)
      .bindPopup('Marina Beach Cleanup')
      .openPopup();
  }

  // --- Weather Section: NEA 24-hour Weather API (JSONP) ---
  const weatherLoading = document.getElementById('weather-loading');
  const weatherError = document.getElementById('weather-error');
  const weatherContent = document.getElementById('weather-content');
  // Helper: Find forecast for a beach area (e.g., Sentosa)
  function findForecast(area, forecasts) {
    return forecasts.find(f => f.area.toLowerCase().includes(area.toLowerCase()));
  }
  function showWeather({area, forecast, temperature}) {
    weatherContent.innerHTML = `
      <div style="font-size:1.2rem; font-weight:bold; color:#2196F3;">${area} Beach</div>
      <div style="font-size:2.2rem; margin:0.5rem 0;">${temperature || '--'}°C ${forecast.includes('Showers') ? '🌦️' : forecast.includes('Fair') ? '☀️' : '⛅'}</div>
      <div style="font-size:1.1rem; color:#FF7043;">${forecast}</div>
    `;
    weatherLoading.style.display = 'none';
    weatherError.style.display = 'none';
    weatherContent.style.display = '';
  }
  function showError(msg) {
    weatherLoading.style.display = 'none';
    weatherContent.style.display = 'none';
    weatherError.textContent = msg;
    weatherError.style.display = '';
  }
  function fetchNEAWeather() {
    weatherLoading.style.display = '';
    weatherError.style.display = 'none';
    weatherContent.style.display = 'none';
    // JSONP workaround
    const script = document.createElement('script');
    const callbackName = 'neaWeatherCallback_' + Math.floor(Math.random()*100000);
    window[callbackName] = function(data) {
      try {
        const forecasts = data.items[0].forecasts;
        // Try Sentosa, fallback to East Coast
        let fc = findForecast('Sentosa', forecasts) || findForecast('East Coast', forecasts) || forecasts[0];
        showWeather({area: fc.area, forecast: fc.forecast, temperature: fc.temperature});
      } catch (e) {
        showError('Weather data unavailable.');
      }
      script.remove();
      delete window[callbackName];
    };
    script.src = `https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?callback=${callbackName}`;
    script.onerror = () => showError('Failed to load weather data.');
    document.body.appendChild(script);
  }
  fetchNEAWeather();

  // --- Social Events Section ---
  const eventForm = document.getElementById('event-form');
  const eventList = document.getElementById('event-list');
  const events = [];
  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value;
    if (!name || !date) return;
    events.push({ name, date });
    renderEvents();
    eventForm.reset();
  });
  function renderEvents() {
    eventList.innerHTML = '';
    events.forEach(ev => {
      const li = document.createElement('li');
      li.textContent = `${ev.name} - ${ev.date}`;
      eventList.appendChild(li);
    });
  }
});
