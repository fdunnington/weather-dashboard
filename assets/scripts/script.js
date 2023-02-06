//TODO
//1. add onLoad
//2. add AJAX get request
//   api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
//add apiKey const = "82b225f1a74acfbe188e326f3d399e83";

//JS elements
// > search input
// > submit button
// > current date & time
// > current temp
// > current humidity

// > 5-day weather card

$(document).ready(function() {

    

    //page loads previous searches
    function getHistory (){

    }


    //event listener for submit button
    $("#search-button").on("click", function(event){

        event.preventDefault();

        const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
        var city = $("#search-input").val().trim();

        console.log(city);            
        
        $.ajax({
            url: queryURL + city + "&appid=82b225f1a74acfbe188e326f3d399e83", 
            method: "GET"
        }).then(function(data) {
            console.log(data);
        });

        


    });

});