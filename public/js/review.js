$(document).ready(function () {
    // Get references to page elements


    //The API object contains methods for each kind of request we'll make
    var API = {
        getWorkers: function () {
            console.log("get workers called");
            return $.ajax({
                url: "api/workers",
                type: "GET"
            });
        },
        saveReview: function (review) {
            console.log("save review called");
            return $.ajax({
                headers: {
                    "Content-Type": "application/json"
                },
                type: "POST",
                url: "api/reviews",
                data: JSON.stringify(review)
            });
        },
        getReviews: function (workerId) {
            console.log("get reviews called");
            return $.ajax({
                url: "api/getreviews/" + workerId,
                type: "GET"
            });
        },
        updateRating: function (workerId, dataObj) {
            console.log("update rating called");
            return $.ajax({
                headers: {
                    "Content-Type": "application/json"
                },
                type: "POST",
                url: "api/updaterating/" + workerId,
                data: JSON.stringify(dataObj)
            });
        }

    };


    var handleAddReview = function (event) {

        API.getWorkers().then(function (result) {

            // add contractors to the dropdown
            $("#contractor-dropdown").append($("<option>", {
                value: 0,
                text: "-- Select Contractor --",
                "data-workername": " "
            }));


            for (var i = 0; i < result.length; i++) {
                $("#contractor-dropdown").append($("<option>", {
                    value: result[i].id,
                    text: result[i].name + " - " + result[i].specialty,
                    "data-workername": result[i].name,
                    "data-id": result[i].id
                }));

            }

        });
        // display the modal (unhide)
        // $("#review-modal").modal("toggle");
    };

    // submit a new review for a contractor
    var handleSubmitReview = function (event) {
        event.preventDefault();

        // get worker name & id from the dropdown
        var tempname = $("#contractor-dropdown").find("option:selected").data("workername");
        var currentId = $("#contractor-dropdown").find("option:selected").data("id");


        var newReview = {
            comment: $("#comment").val(),
            rating: $("input[name='optradio']:checked").val(),
            email: $("#review-email").val(),
            workername: tempname,
            WorkerId: $("#contractor-dropdown").val()
        };

        // validate the modal
        var isValid = true;

        if ((newReview.comment === "") || (newReview.rating === undefined) ||
            (newReview.email === "") || (newReview.WorkerId === "0")) {
            isValid = false;
        }

        // If all fields are valid, add data to the reviews table

        if (isValid) {

            API.saveReview(newReview).then(function () {
                console.log("Returned from saveReview");
            });

            // clear the modal contents 
            $("#comment").val("");
            $("#review-email").val("");
            $("#contractor-dropdown").empty();
            $("input[name='optradio']:checked").prop("checked", false);

            // hide the modal
            // $("#review-modal").modal("toggle");

            alert("Thank you for your review.  We will contact you through email.");

            // calculate the new average rating for the contractor
            API.getReviews(currentId).then(function (result) {

                var total = 0;
                var numberOfReviews = result.length;
                for (var i = 0; i < numberOfReviews; i++) {
                    total = total + result[i].rating;
                }

                var avgRating = total / numberOfReviews;
                // var roundedAvg = Math.round(avgRating);
                var roundedAvg = avgRating.toFixed(1)

                var updateObject = {
                    rating: roundedAvg
                };

                // update the contractor's rating
                API.updateRating(currentId, updateObject).then(function (result) {
                    console.log("Successful update of contractor rating");
                });
            });
        }

        // invalid input
        else {
            alert("Invalid data - please complete all fields");
        }
    };

    var handleCancelReview = function (event) {
        event.preventDefault();

        // clear the modal contents
        $("#comment").val("");
        $("#review-email").val("");
        $("#contractor-dropdown").empty();
        $("input[name='optradio']:checked").prop("checked", false);
    };

    // $("#add-review").on("click", handleAddReview);

    handleAddReview();

    $("#submit-review").on("click", handleSubmitReview);
    $("#cancel-review").on("click", handleCancelReview);
});