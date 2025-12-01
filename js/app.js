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

  // --- Weather Section ---
  const weatherForm = document.getElementById('weather-form');
  const weatherResult = document.getElementById('weather-result');
  weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value.trim();
    if (!city) return;
    weatherResult.textContent = 'Loading...';
    try {
      // Replace 'YOUR_API_KEY' with a real OpenWeatherMap API key
      const apiKey = 'YOUR_API_KEY';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      weatherResult.innerHTML = `
        <strong>${data.name}</strong>: ${data.weather[0].main}, ${data.main.temp}&deg;C
        <br><small>Wind: ${data.wind.speed} m/s</small>
      `;
    } catch (err) {
      weatherResult.textContent = 'Weather not found.';
    }
  });

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
