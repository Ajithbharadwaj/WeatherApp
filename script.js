let map;
document.getElementById("getWeather").addEventListener('click',()=>{
    const city = document.getElementById("cityInput").value;
    const errorMessage = document.getElementById("errorMessage");
    const weatherResult = document.getElementById("weatherResult"); 
    if(!city){
        errorMessage.textContent = `Please Enter a valid City!!`;
        return;
    }
    else{
        errorMessage.textContent = '';
        const apiKey = `9f3c6e5d73448437530cd37ab4159c8a`;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
        .then(response => response.json())
        .then(data =>{
            console.log("Data: ",data);
            if(data.cod === '404'){
                weatherResult.innerHTML = "City Not Found!!";
                return;
            }
            const weather = `
                <h2>Weather in ${data.name}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
            weatherResult.innerHTML = weather;
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            initMap(lat,lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherResult.innerHTML = 'Error fetching weather data';
        });
    }
});

function initMap(lat, lon) {
    if (map) {
        // If the map is already initialized, just update its center and marker
        map.setView([lat, lon], 10);
        // Remove existing marker
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    } else {
        // Create a new map instance if it doesn't already exist
        map = L.map('map').setView([lat, lon], 10);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    // Add a marker at the location
    L.marker([lat, lon]).addTo(map)
        .bindPopup('Location')
        .openPopup();
}