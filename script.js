var apiKey = "a4dfbbd7b97d4fbccabf92c4fedca3b3";
var formEl = $("#city-form");
var cityEl = $('input[name="city-name"]');
var cityAndDateEl = document.querySelector("#cityAndDate");
var currentCityEl = document.querySelector("#currentTemp");
var currentTempEl = document.querySelector("#currentTemp");
var currentWindEl = document.querySelector("#currentWind");
var currentHumidityEl = document.querySelector("#currentHumidity");
var currentUV_El = document.querySelector("#currentUV");
var cardDateEl = document.querySelector("#cardDate");
var cardTempEl = document.querySelector("#cardTemp");
var cardWind = document.querySelector("#cardWind");
var cardHumidity = document.querySelector("#cardHumidity");

function handleSubmit(event) {
  event.preventDefault();
  showCityHistory();
  saveCity();
  getApi();
}

// Save city locally
function saveCity() {
  var key = cityEl.val();
  localStorage.setItem(key, JSON.stringify(key));
}

// Render city search history
function showCityHistory() {
  for (var i = 0; i < localStorage.length; i++) {
    var cityKey = localStorage.key(i);
    $("#citySearchList").append($("<li class= list-group-item>" + cityKey + "</li>"));
  }
}

// Get Weather
function getApi(requestUrl) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityEl.val() +
    "&appid=" +
    apiKey +
    "&units=imperial";
  fetch(requestUrl)
    .then(function (respose) {
      return respose.json();
    })
    .then(function (data) {
      cityLatitude = data.coord.lat;
      cityLongitude = data.coord.lon;
      getForecast(cityLatitude, cityLongitude);
    })
    .catch(function (error) {
      alert("Invalid");
    });

  // 2nd call with lat + long
  function getForecast(cityLatitude, cityLongitude) {
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityLatitude +
        "&lon=" +
        cityLongitude +
        "&appid=" +
        apiKey +
        "&units=imperial"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        showWeatherForecast(data);
      });
  }
}

// get data from API and update page
function showWeatherForecast(data) {
  var cityTemp = data.current.temp;
  var cityWindSpeed = data.current.wind_speed;
  var cityHumidity = data.current.humidity;
  var currentUVI = data.current.uvi;
  // update current city info
  cityAndDateEl.textContent = cityEl.val() + " " + dayjs().format("(MM/DD/YYYY)");
  currentTempEl.textContent = "Temp: " + cityTemp + " F";
  currentWindEl.textContent = "Wind: " + cityWindSpeed + " MPH";
  currentHumidityEl.textContent = "Humidity: " + cityHumidity + "%";
  currentUV_El.textContent = "UV Index: " + currentUVI;
  // Delete 5 day forecast before adding new
  // $(".container")
  // 5 day forecast update to cards
  for (var i = 0; i < 5; i++) {
    $(".container").append(`<div class="card">
    <div class="card-body">
      <h5 class="card-title">${dayjs().add(i, "day").format("MM/DD/YYYY")}</h5>
      <ul class="list-group">
        <li class="list-group-item"> <img src="https://openweathermap.org/img/wn/${
          data.daily[i].weather[0].icon
        }.png"/></li>
        <li class="list-group-item">Temp: ${data.daily[i].temp.day}F</li>
        <li class="list-group-item">Wind: ${data.daily[i].wind_speed} MPH</li>
        <li class="list-group-item">Humidity: ${data.daily[i].humidity}%</li>
        <li class="list-group-item"></li>
      </ul>
    </div>
  </div>`);
  }
}

// submit event
formEl.on("submit", handleSubmit);
showCityHistory();
