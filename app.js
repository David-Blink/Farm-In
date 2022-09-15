function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
//Geo-Coordinates
function showPosition(position) {
// Capture coordinates and location elements
    // let coord = document.getElementById("coordinates");
    let loc = document.getElementById("location");
    // Retrieve lat lon from position
    let lat = position.coords.latitude.toFixed(6);
    let long = position.coords.longitude.toFixed(6);
    // Update lat lon
    // coord.innerHTML = "Latitude: " + lat + "<br>Longitude: " + long;
    // Retrieve location from lat lon with reverse geocoding
    var cord = lat + "  " + long;
    console.log(cord);
    const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + long;
    let headers = new Headers({"User-Agent":"Codepen-io Test"});
    fetch(url, { headers: headers })
    .then(response => response.json())
    .then(data => {
        let preferred_labels = ["village", "town", "city", "municipality" ];
        preferred_labels.some(function(label) {
            if (data.address.hasOwnProperty(label)) {
            // Update location
            loc.innerHTML = data.address[label] + ", India";
            console.log(loc.value);
            return true;
            }
        });
    }).catch(err => console.log(err));

    // Map
    mapboxgl.accessToken = 'pk.eyJ1IjoiLS1ibGluay0tIiwiYSI6ImNsN2txMnIyMDA5NXAzd284aDJveHQ2cHcifQ.u9DS9qAVSM1I-vWZSZNyfA';
    const map = new mapboxgl.Map({
        container: 'map', 
        style: 'mapbox://styles/mapbox/satellite-streets-v11', 
        center: [long, lat], // starting position [lng, lat]
        zoom: 9, // starting zoom
        projection: 'globe' // display the map as a 3D globe
    });    
    map.on('style.load', () => {
        map.setFog({}); 
    });


    //Weather
    const API_KEY = `3265874a2c77ae4a04bb96236a642d2f`
    const weather = document.querySelector("#weather")
    // const API = `https://api.openweathermap.org/data/2.5/weather?
    // q=${city}&appid=${API_KEY}&units=metric`
    // const IMG_URL = `https: //openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    const getWeather = async(city) => {
        weather.innerHTML = `<h2> Loading... <h2>`
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        const response = await fetch(url);
        const data = await response.json()
        return showWeather(data)
    }
    const showWeather = (data) => {
        if (data.cod == "404") {
            weather.innerHTML = `<h2> City Not Found <h2>`
            return;
        }
        weather.innerHTML = `<div>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
            </div>
            <div>
                <h2>${data.main.temp} ℃</h2>
                <h4> ${data.weather[0].main} </h4>
            </div>        `
    }

    document.addEventListener("DOMContentLoaded",function(event) {
            getWeather(loc.value)
            event.preventDefault();
        }
    )
}