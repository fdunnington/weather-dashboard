
$(document).ready(function() {

    const apiKey = "82b225f1a74acfbe188e326f3d399e83";
    var cityID = $("#search-input").val();
    localStorage.setItem("cityName", cityID);
    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    // const tempID = $(".temp");
    // const windData = $(".wind");
    // const humidity = $(".humidity");
    // const weatherIcon = $("#weather-image");
    const today = moment().format("ddd DD MMM YYYY");
    const forecast = $("#forecast");
    var cities = [];

    console.log


    //-------------------------------------------------    
    //event listener for submit button
    //-------------------------------------------------

    $("#search-button").on("click", function(event){


        if (cityID !== "") {
           // localStorage.setItem("City", cityID);
            // localStorage.setItem("Lat", lat);
            // localStorage.setItem("Lon", lon);
        } else {
            alert("Type in a city name and hit search");
        };            

        event.preventDefault();
        todaysData();
        getForecast();
        

    });  


    //-------------------------------------------------
    //pull and display todays data in #today
    //-------------------------------------------------
    function todaysData() {
        
        $.ajax({
            url: queryURL + cityID + "&appid=" + apiKey + "&units=metric", 
            method: "GET"
        }).then(function(data) {
            

            const today = moment().format("D MMM YYYY");
            $("#chosen-location").text(cityID + " (" + today + ") ");
            $("#current-temp").text(data.list[0].main.temp + "°C");
            $("#current-wind").text(data.list[0].wind.speed + "mps");
            $("#current-humidity").text(data.list[0].main.humidity  + "%");

        });

    };

    //-------------------------------------------------
    //pull and display data in #forecast
    //-------------------------------------------------
    function getForecast() {

       

        $.ajax({
            url: queryURL + cityID + "&appid=" + apiKey + "&units=metric", 
            method: "GET"
        }).then(function(data) {
            var forecastData = data.list;
            console.log(forecastData);
            const newData = [];

            function getEvery8th() {                    
                const maxVal = 5;
                const every8th = Math.floor((forecastData.length) / maxVal);
                
                for (i = 0; i < forecastData.length; i+=every8th) {
                    newData.push(forecastData[i]);                  
                }

            };
            getEvery8th()
            
            console.log(newData.length);
            for (var i = 0; i <= newData.length; i++) {
                
                //create card body
                var forecastDiv = $("#weather-forecast");
                // var weatherForecast = $('<div>');
                // var weatherCard = $('<div>');
                // var weatherIcon = $("<p>").append(iconURL);
                var IconID = newData[i].weather[0].icon;
                console.log(newData);
                var iconURL = $('<img>').attr({ "src": "https://openweathermap.org/img/w/" + IconID + ".png" });
                // var weatherIcon = $("<img>").append(iconURL);
            
                var weatherForecast = $('<div>').attr({ "class": "card-body" });

                var forecastTemp = $('<p>').text("Temp: " + (newData[i].main.temp).toFixed(0) + "°C");
                var forecastWind = $('<p>').text("Wind: " + (Number(newData[i].wind.speed) * 1.94384).toFixed(2) + "kts");
                var forecastHumidity = $('<p>').text("Humidity: " + newData[i].main.humidity  + "%");

                console.log((newData[i].main.temp).toFixed(0) + "°C");

                forecastDiv.append(weatherForecast);
                weatherForecast.append(iconURL, forecastTemp, forecastWind, forecastHumidity);

            };
        });
    };





});
