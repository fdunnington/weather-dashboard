$(document).ready(function() {

    const apiKey = "82b225f1a74acfbe188e326f3d399e83";
    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    const today = moment().format("DD MMM YY");
    let cityID;
    let cities = [];
    let searchedCity;
    let newCity = "London";
    const history = $("#history");
    $("#search-input").val('');

    //-------------------------------------------------
    //pulls cities array from localStorage and displays as search history (clickable buttons)
    //-------------------------------------------------
    function searchHistory() {
        $("#history").empty();

        for (let i = 0; i < cities.length; i++) {
            myCity = JSON.parse(localStorage.getItem("cityName"));
            searchedCity = $("<button>");
            searchedCity.text(myCity[i]);
            searchedCity.addClass(searchedCity);
            history.prepend(searchedCity);
        };

        return;

    };
    searchHistory();
      
    //-------------------------------------------------
    //pulls and display todays data in #today
    //-------------------------------------------------
    function todaysData() {
        $.ajax({
            url: queryURL + newCity + "&appid=" + apiKey + "&units=metric", 
            method: "GET",
            dataType: "json",
        }).then(function(data) { 
                $("#chosen-location").text(newCity);
                $("#todays-date").text (" (" + today + ") ");
                $("#current-temp").text(data.list[0].main.temp.toFixed(0) + "°C");
                $("#current-wind").text(Number(data.list[0].wind.speed * 1.94384).toFixed(0) + "kts");
                $("#current-humidity").text(data.list[0].main.humidity.toFixed(0)  + "%"); 
        });

        return;
    };
    todaysData();

    //-------------------------------------------------
    //pulls and display todays and following 4 days data in #forecast
    //-------------------------------------------------
    function getForecast() {

        $.ajax({
            url: queryURL + newCity + "&appid=" + apiKey + "&units=metric", 
            method: "GET"
        }).then(function(data) {
            const forecastData = data.list;
            const newData = [];
           
            //function to take every eigth item from array (original dataset from OpenWeather has 8 x 3hr timeblocks per day). Would like to change code so it shows date for specific time (e.g. midday) irrespective of searched country, but at the moment it shows weather at current time. 
            function getEvery8th() {                    
                const maxVal = 5;
                const every8th = Math.floor((forecastData.length) / maxVal);
                
                for (i = 0; i < forecastData.length; i+=every8th) {
                    newData.push(forecastData[i]);                  
                }

                return;
            };
            getEvery8th()
            
            const forecastDiv = $("#weather-forecast");
            //empty weather-forecast div so new data only shown each time a search is requested
            forecastDiv.empty();

            for (let i = 0; i <= newData.length; i++) {
                //create elements for card body
                const IconID = newData[i].weather[0].icon;
                const iconURL = $('<img>').attr({ "src": "https://openweathermap.org/img/w/" + IconID + ".png" });
                const weatherForecast = $('<div>').attr({ "class": "card-body"});
                const forecastTitle = $("#5dayForecast").text("Five day forecast: ");
                const forecastTemp = $('<p>').text("Temp: " + (newData[i].main.temp).toFixed(0) + "°C");
                const forecastWind = $('<p>').text("Wind: " + (Number(newData[i].wind.speed) * 1.94384).toFixed(0) + "kts");
                const forecastHumidity = $('<p>').text("Humidity: " + newData[i].main.humidity.toFixed(1)  + "%");

                //extract current day from dt property of newData array
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              
                const d = new Date(newData[i].dt * 1000);
                const dayName = days[d.getDay()];
                
                //append required info to card body
                forecastDiv.append(weatherForecast);
                weatherForecast.append(dayName, iconURL, forecastTemp, forecastWind, forecastHumidity);
            };

        return;

        });
    };

    //-------------------------------------------------    
    //event listener for submit button: sets CityID (for 5 day forecast and todays data), and pushes input cityname to [cities], and
    //-------------------------------------------------
    $("#search-button").on("click", function(event){
        event.preventDefault();

        cityID = $("#search-input").val().trim().toLowerCase();
        cities.push(cityID);
        localStorage.setItem("cityName", JSON.stringify(cities)); 
       
        for (i=0; i <cities.length; i++) {
            if (cityID === "") {
                alert("Type in a city name and hit search");
                return;
            } else {
                newCity = cities[i];
                todaysData();
                getForecast();
                searchHistory()
                $("#search-input").val('');
            };  
        };
        
        
        
    });

    //-------------------------------------------------
    //allows search history buttons to be used to re-conduct search for that city
    //-------------------------------------------------
    $("#history").on("click", function(event){
        //sets newCity (and therefore OpenWeather city parameter) to the text of the clicked button
        newCity = $(event.target).text();
              
        $.ajax({
          url: queryURL + newCity + "&appid=" + apiKey + "&units=metric",
          method: "GET"
        }).then(function(data) {
            todaysData();
            getForecast();
            //clear input value when history button clicked
            $("#search-input").val('');
        });
    });

});