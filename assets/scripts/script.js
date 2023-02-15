
$(document).ready(function() {

    const apiKey = "82b225f1a74acfbe188e326f3d399e83";
    var cities = [];
    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    const today = moment().format("DD MMM YY");
    // const forecast = $("#forecast"); //delete this?
    var newCity = "London";
    const history = $("#history");



//NEW
    function searchHistory() {
        const cities = JSON.parse(localStorage.getItem("cityName"));

    for (let i = 0; i <cities.length; i++) {
        var searchedCity = $('<button>').text(cities[i]);
        history.prepend(searchedCity);
    }

    };
    searchHistory();
//end NEW  (plus moved event listener below functions. If not working then move back to top)
      

    //-------------------------------------------------
    //pull and display todays data in #today
    //-------------------------------------------------
    function todaysData() {
        $.ajax({
            url: queryURL + newCity + "&appid=" + apiKey + "&units=metric", 
            method: "GET"
        }).then(function(data) { //add [31] to get 12:00 data? If so then do same on 5day forecast
                $("#chosen-location").text(newCity + " (" + today + ") ");
                $("#current-temp").text(data.list[0].main.temp + "°C");
                $("#current-wind").text(data.list[0].wind.speed + "mps");
                $("#current-humidity").text(data.list[0].main.humidity  + "%"); 
        });
    };

    todaysData();

    //-------------------------------------------------
    //pull and display data in #forecast
    //-------------------------------------------------
    function getForecast() {

        $.ajax({
            url: queryURL + newCity + "&appid=" + apiKey + "&units=metric", 
            method: "GET"
        }).then(function(data) {
            var forecastData = data.list;
            const newData = [];

            function getEvery8th() {                    
                const maxVal = 5;
                const every8th = Math.floor((forecastData.length) / maxVal);
                
                for (i = 0; i < forecastData.length; i+=every8th) {
                    newData.push(forecastData[i]);                  
                }
            };

            getEvery8th()
            

            const forecastDiv = $("#weather-forecast");
            forecastDiv.empty();
            for (var i = 0; i <= newData.length; i++) {
                
                //create card body

                var IconID = newData[i].weather[0].icon;
                var iconURL = $('<img>').attr({ "src": "https://openweathermap.org/img/w/" + IconID + ".png" });
            
                var weatherForecast = $('<div>').attr({ "class": "card-body"});
                var forecastTitle = $("#5dayForecast").text("Five day forecast: ");
                var forecastTemp = $('<p>').text("Temp: " + (newData[i].main.temp).toFixed(0) + "°C");
                var forecastWind = $('<p>').text("Wind: " + (Number(newData[i].wind.speed) * 1.94384).toFixed(2) + "kts");
                var forecastHumidity = $('<p>').text("Humidity: " + newData[i].main.humidity  + "%");


                forecastDiv.append(weatherForecast);
                weatherForecast.append(iconURL, forecastTemp, forecastWind, forecastHumidity);
                
            };
        });
    };

    //-------------------------------------------------    
    //event listener for submit button
    //-------------------------------------------------
    $("#search-button").on("click", function(event){
        event.preventDefault();

        let cityID = $("#search-input").val();
        cities.push(cityID);
        localStorage.setItem("cityName", JSON.stringify(cities)); //use if statement to prevent duplicates?
    
        if (cityID === "") {
            alert("Type in a city name and hit search");
        } else {
            newCity = (cities[cities.length-1]);
        };            

        todaysData();
        getForecast();
        searchHistory()
        
    });

//NEW
    $(searchedCity).on("click", function(event){
        cityID = event.target.text("");

        todaysData();
        getForecast();
    });
//end NEW

});
