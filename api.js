
let api_key = "3e35af6d69dcc9126d9df7a3b0cdb06d";


document.addEventListener("DOMContentLoaded", () => {

    // Get html element by id
    let leftcard = document.querySelectorAll(".weather_left .card")[0];
    let fivedayscard = document.querySelectorAll(".weather_left .card")[1]; 
    let air_quality_card = document.querySelectorAll(".highlights .card")[0];
    let air_quality_list = ['Good', 'Fair', 'Moderate', 'Unhealthy', 'Very Unhealthy'];
    let hourly_forecast_card = document.querySelectorAll(".hourly_forecast")[0];

    // VAL Part

    let humidityVal = document.getElementById("humidityVal");
    let pressureVal = document.getElementById("pressureVal");
    let visibilityVal = document.getElementById("visibilityVal");
    let wind_speedVal = document.getElementById("wind_speedVal");
    let CloudinessVal = document.getElementById("CloudinessVal");
    let feels_likeVal = document.getElementById("feels_likeVal");

    // VAL Part

    const Btn_search = document.querySelector("#Btn_search");

    Btn_search.addEventListener("click", () => {
        let cityName =  document.getElementById("city_input").value;
        if (cityName) {
            fetchweather(cityName);
        }
        else{
            console.log("City name is empty");
        }
    });

    // API Connection 
    /*
        Source page of API KEY
        Forecast_url: https://openweathermap.org/forecast5
        Weather_url: https://openweathermap.org/current
        Air_pullution_url: https://openweathermap.org/api/air-pollution
    */
    function getWeatherData(name, lat, lon, country, state) {
        let Forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
        let Weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&lat=${lat}&lon=${lon}&appid=${api_key}`;
        let Air_pullution_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // fetch part
        /*
            In this fetch part:
            .response and .catch are used to handle the response and error respectively. (DO NOT NEED TO CHANGE!!!) 
            Only .then(data => { }) part is the main part to get data from API. (You Can change this part!!!)
        */

        fetch(Air_pullution_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok" + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
                
                air_quality_card.innerHTML = `
                        <div class="card_head">
                            <p>Air Quality Index</p>
                            <p class="air_index aqi-${data.list[0].main.aqi}">${air_quality_list[data.list[0].main.aqi - 1]}</p>
                        </div>
                        <div class="air_indices">
                            <i class="fa-solid fa-wind fa-3x"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                            <div class="item">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                            <div class="item">
                                <p>S02</p>
                                <h2>${so2}</h2>
                            </div>
                            <div class="item">
                                <p>CO</p>
                                <h2>${co}</h2>
                            </div>
                            <div class="item">
                                <p>NO</p>
                                <h2>${no}</h2>
                            </div>
                            <div class="item">
                                <p>NO2</p>
                                <h2>${no2}</h2>
                            </div>
                            <div class="item">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                            <div class="item">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>    
                        </div>
                `;
                console.log(data);
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });


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
               
                // Update VAL 

                let {humidity, pressure, feels_like} = data.main;
                let visibility = data.visibility;
                let wind_speed = data.wind.speed;
                let Cloudiness = data.clouds.all;

                humidityVal.innerHTML = `${humidity}%`;
                pressureVal.innerHTML = `${pressure} hPa`;
                visibilityVal.innerHTML = `${visibility / 1000} km`;
                wind_speedVal.innerHTML = `${wind_speed} m/s`;
                feels_likeVal.innerHTML = `${(feels_like - 273.15).toFixed(2)} &deg;C`;
                CloudinessVal.innerHTML = `${Cloudiness}%`;
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
                let hourlyforecast = data.list;
                hourly_forecast_card.innerHTML = ``;
                for(i = 0; i<= 7;i++){  
                    let hourlyforecastDATE = new Date(hourlyforecast[i].dt_txt);
                    let hr = hourlyforecastDATE.getHours();
                    let a = 'PM';
                    if(hr < 12){
                        a = 'AM';
                    }
                    if(hr == 0){
                        hr = 12;
                    }
                    if(hr > 12){
                        hr = hr - 12;
                    }
                    hourly_forecast_card.innerHTML += `
                        <div class="card">                      
                            <p>${hr} ${a}</p>
                            <img src="https://openweathermap.org/img/wn/${hourlyforecast[i].weather[0].icon}.png" alt="">
                            <p>${(hourlyforecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                        </div>
                    `;
                }

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
                // console.log(fivedays); // debugging purpose

            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });
    }
    window.getWeatherData = getWeatherData; // Expose the function to the global


    // get weather data by city name
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
                let { name } = data;
                let { lat, lon } = data.coord;
                let country = data.sys.country; 
                let state = ""; 
                getWeatherData(name, lat, lon, country, state);
                // console.log(data); debugging purpose
                // console.log(name, lat, lon, country, state); debugging purpose
                // getWeatherData is the main function to get weather data(Upper side!!!)
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
            });
    }


    // Get location from browser(Safari Cannot use this, since not https)
    function getPosition(){
        navigator.geolocation.getCurrentPosition(position => {
            let {latitude, longitude} = position.coords;
            let Reverse_GEO_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
            
            fetch(Reverse_GEO_url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok" + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    let { name, country, state } = data[0];
                    fetchweather(state);
                })
                .catch(error => {
                    console.error("There has been a problem with your fetch operation:", error);
                });
        });
    }


    Btn_location.addEventListener("click", getPosition);





});





