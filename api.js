
const api_key = "3e35af6d69dcc9126d9df7a3b0cdb06d";


document.addEventListener("DOMContentLoaded", () => {

    // Get html element by id
    let leftcard = document.querySelectorAll(".weather_left .card")[0];
    let fivedayscard = document.querySelectorAll(".weather_left .card")[1]; 

    const Btn_search = document.querySelector("#Btn_search");
    Btn_search.addEventListener("click", () => {
        let cityName =  document.getElementById("city_input").value;
        if (cityName) {
            console.log(cityName);
            fetchweather(cityName);
        }
        else{
            console.log("City name is empty");
        }
    });

    function getWeatherData(name, lat, lon, country, state) {
        let Forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
        let Weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&lat=${lat}&lon=${lon}&appid=${api_key}`;
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Now location information    

        fetch(Weather_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok" + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                let date = new Date();
                leftcard.innerHTML = ` 
                    <div class="current_weather">
                        <div class="weather_details">
                            <p>Now</p>
                            <h2>${(data.main.temp-273.15).toFixed(2)}&deg;C</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather_icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
                        </div>
                    </div>
                    <hr>
                    <div class="card_footer">
                        <p><i class="fa-solid fa-calendar fa-2x"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date. getMonth()]}, ${date.getFullYear()}</p>
                        <p><i class="fa-solid fa-location-dot fa-2x"></i> ${name}, ${country}</p>
                    </div>
                `;

            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });

        // Forcast information    

        fetch(Forecast_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok" + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                let uniqueForecast = [];
                let fivedays = data.list.filter(forecast => {
                    let forecastDate = new Date(forecast.dt_txt).getDate();
                    if(!uniqueForecast.includes(forecastDate)){
                        return uniqueForecast.push(forecastDate);
                    }
                })
                fivedayscard.innerHTML = ``;
                for(i = 1; i< fivedays.length;i++){
                    let date = new Date(fivedays[i].dt_txt);
                    fivedayscard.innerHTML += `
                    <div class="day_forecast">
                        <div class="forecast_item">
                            <div class="icon_wrapper">
                                <img src="https://openweathermap.org/img/wn/${fivedays[i].weather[0].icon}.png" alt="">
                                <span><b>${(fivedays[i].main.temp - 273.15).toFixed(2)}&deg;C</b></span>
                            </div>
                            <p><u>${date.getDate()} ${months[date.getMonth()]}</u></p>
                            <p><u>${days[date.getDay()]}</u></p>
                        </div>
                    </div>                    
                    `;
                }
                console.log(fivedays);

            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });

    }


    function fetchweather(cityName) {
        const GEO_url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`;
        fetch(GEO_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok" + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                let { name } = data;
                let { lat, lon } = data.coord;
                let country = data.sys.country; 
                let state = ""; 
                getWeatherData(name, lat, lon, country, state);
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });
    }


    Btn_location.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation not supported");
        }
    });
    
    function showPosition(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("Latitude:", lat, "Longitude:", lon);
    };






});





