var apiKey = "a4dfbbd7b97d4fbccabf92c4fedca3b3";
var formEl = $("#city-form");
var cityEl = $('input[name="city-name"]');
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

// Save city locally, add to list
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
      // console.log(data);
      cityLatitude = data.coord.lat;
      cityLongitude = data.coord.lon;
      getForecast(cityLatitude, cityLongitude);
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
        // console.log(data);
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
  currentTempEl.textContent = "Temp: " + cityTemp + " F";
  currentWindEl.textContent = "Wind: " + cityWindSpeed + " MPH";
  currentHumidityEl.textContent = "Humidity: " + cityHumidity + "%";
  currentUV_El.textContent = "UV Index: " + currentUVI;
}

//   for (var i = 0; i < 5; i++) {
//     $(".createForecast").append(`<div class="card">
//   <div class="card-body">
//     <h5 class="card-title">03/31/2021</h5>
//     <ul class="list-group">
//       <li class="list-group-item">Temp</li>
//       <li class="list-group-item">Temp</li>
//       <li class="list-group-item">Temp</li>
//       <li class="list-group-item">Temp</li>
//     </ul>
//   </div>
// </div>`);
//   }

// submit event
formEl.on("submit", handleSubmit);
