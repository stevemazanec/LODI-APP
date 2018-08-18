$(document).ready(function () {

    //Sets the default coordinates for the map along with the zoom level
    var mymap = L.map('mapid').setView([41.500, -81.600], 8);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        //Uses mapbox for the tiled streetview
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoic3RldmVtYXphbmVjIiwiYSI6ImNqa2xmaWM5ZjBveXozd3BjemtmNzY4bmcifQ.S0cxoUekQHa6Pa9AkCk8Ig'
    }).addTo(mymap);

    function addMarkers() {

        //Loops through each plumber and adds them to the map using their latitude and longitude
        $.get("/api/windows", function (data) {
            for (var i = 0; i < data.length; i++) {
                var lat = data[i].latitude;
                var long = data[i].longitude;

                //Adds a marker indicating the plumber's location, along with their name
                var marker = L.marker([lat, long]).addTo(mymap);
                marker.bindPopup(data[i].name).openPopup();

                //Adds a circle indicating the radius the plumber works, along with their name
                var circle = L.circle([lat, long], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.3,
                    radius: data[i].distance
                }).addTo(mymap);
                circle.bindPopup(data[i].name).openPopup();
            }
        })
    }

    addMarkers();

    //Makes it so the user can sort workers according to name, hourly rate, or rating, but not by picture or phone number
    $(".table").tablesorter({
        headers: {
            1: {
                sorter: false
            },
            2: {
                sorter: false
            }
        }
    });

    //The API object contains methods for requests made
    var API = {

        getReviews: function (workerId) {
            console.log("get reviews called");
            return $.ajax({
                url: "api/getreviews/" + workerId,
                type: "GET"

            });
        }
    };

    var handleDisplayReviews = function (event) {
        event.preventDefault();
        var currentname = $(this).find('td:first').text();
        var currentId = $(this).attr("data-id");
        var imgSrc = $(this).find('td').eq(1).html();

        $('#my_image').append(imgSrc);
        // display the modal (unhide)
        $("#review-modal").modal("toggle");


        // display all reviews
        API.getReviews(currentId).then(function (result) {
            $("#modal-title").text("All reviews for " + currentname);
           
 $('#my_image').empty();
            $('#my_image').append(imgSrc);
            $("#review-div").empty();


            for (var i = 0; i < result.length; i++) {
                var currentDate = result[i].createdAt.substring(5, 10) + "-" + result[i].createdAt.substring(0, 4);
                $("#review-div").append("<p>Rating: " + result[i].rating + "</p>");
                $("#review-div").append("<p>Date: " + currentDate + "</p>");
                $("#review-div").append("<p>Comment: " + result[i].comment + "</p>");
                $("#review-div").append("<p>--------------------------------------</p>");
            }
        });
    };

    // display all reviews for the selected worker
    $(".worker-row").on("click", handleDisplayReviews);
});