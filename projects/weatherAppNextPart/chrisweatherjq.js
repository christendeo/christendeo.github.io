$(document).ready(function () {
    // Get location
    navigator.geolocation.getCurrentPosition(success, error);
    function success(pos) {
        let lat = pos.coords.latitude;
        let long = pos.coords.longitude;
        weather(lat, long)
    }

    function error() {
        console.log("Oh no! There's an error :(");
    }

    function weather(lat, long) {
       let URL = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${long}`;
       $.getJSON(URL, function (data) {
           console.log(data);
           updateDOM(data);
       });
    }

    function updateDOM(data) {
       let city = data.name;
       let temp = Math.round(data.main.temp);
       let desc = data.weather[0].description;
       let icon = data.weather[0].icon;

       // Extra variables
       let latitude = data.coord.lat;
       let longitude = data.coord.lon;
       let feelsLike = Math.round(data.main.feels_like);
       let humidity = Math.round(data.main.humidity);
       let timez = data.timezone;
       let windSpeed = Math.round(data.wind.speed);

       $("#city").html(city);
       $("#temp").html(temp);
       $("#desc").html(desc);
       $("#icon").attr("src", icon);

       // Extra weather info that the tutorial did no include
       $("#longitude").html("Longitude: " + longitude);
       $("#latitude").html("Latitude: " + latitude);
       $("#feels").html(feelsLike);
       $("#humidity").html("Humidity: " + humidity);
       $("#windspeed").html("Wind Speed: " + windSpeed);
       $("#timezone").html("Time Zone: " + timez);
    }
});