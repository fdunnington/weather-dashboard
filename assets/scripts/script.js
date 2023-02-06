
$(document).ready(function() {

    //function to show saved city button after refresh
    function showSavedData() {

    }

    //-------------------------------------------------    
    //event listener for submit button
    //-------------------------------------------------
  
   
    $("#search-button").on("click", function(event){
        event.preventDefault();
        todaysData();
        getForecast();
        //saveCity();
    }); 

    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    const apiKey = "82b225f1a74acfbe188e326f3d399e83";
    const cityID = $("#search-input").val().trim();

    const tempID = $(".temp");
    const windData = $(".wind");
    const humidity = $(".humidity");
    const weatherIcon = $("#weather-image");
    const today = moment().format("ddd DD MMM YYYY");
    const forecast = $("#forecast");




    //-------------------------------------------------
    //pull and display todays data in #today
    //-------------------------------------------------
    function todaysData() {


        $.ajax({
            url: queryURL + cityID + "&appid=" + apiKey + "&units=metric", 
            method: "GET"
        }).then(function(data) {
            console.log(data);  
            let i = 4;
            
            $("#chosen-location").text(chosenLocation + ": ");
            $("#todays-date").text(today);
            $("#current-temp").text((data.list[i].main.temp).toFixed(0) + "°C");
            $("#current-wind").text((Number(data.list[i].wind.speed) * 1.94384).toFixed(2) + "kts");
            $("#current-humidity").text(data.list[i].main.humidity  + "%");

            
        });
    };

    //-------------------------------------------------
    //pull and display data in #forecast
    //-------------------------------------------------
    function getForecast() {
        //clear for new search result
    $("#weather-forecast").html("");
    $.ajax({
        url: queryURL + cityID + "&appid=" + apiKey + "&units=metric", 
        method: "GET"
    }).then(function(data) {


            var forecastData = data.list;


            //divide by 8 since API updates weather every 3 hours a day
            for (var i = 1; i <= forecastData.length / 8; i++) {

                var getIcon = forecastData[i * 7].weather[0].icon;

                //get epoch time and convert to date
                var getForDate = forecastData[i * 4].dt * 1000;
                var getWeatherDate = new Date(getForDate).getDate();
                var getWeatherMonth = new Date(getForDate).getMonth();
                var getWeatherYear = new Date(getForDate).getFullYear();

                var getForTemp = forecastData[i * 4].main.temp;
                var getForHum = forecastData[i * 4].main.humidity;


                //create card body
                var weatherCard = $('<div>').attr({ "class": "card bg-info shadow m-4 flex-container" });

                var weatherForecast = $('<div>').attr({ "class": "card-body" });
                var iconURL = $('<img>').attr({ "src": "https://openweathermap.org/img/w/" + getIcon + ".png" });

                var weatherForDate = $('<p>').html(getWeatherMonth + "/" + getWeatherDate + "/" + getWeatherYear);


                var weatherIcon = $("<p>").append(iconURL);

                var forecastTemp = $('<p>').text("Temp: " + (data.list[i].main.temp).toFixed(0) + "°C");
                var forecastWind = $('<p>').text("Wind: " + (Number(data.list[i].wind.speed) * 1.94384).toFixed(2) + "kts");
                var forecastHumidity = $('<p>').text("Humidity: " + data.list[i].main.humidity  + "%");


                weatherForecast.append(weatherForDate, weatherIcon, forecastWind, forecastTemp, forecastHumidity);

                weatherCard.append(weatherForecast);
                $("#weather-forecast").append(weatherCard);

            }


        })
    };


});