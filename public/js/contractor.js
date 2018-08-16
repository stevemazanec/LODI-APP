$(document).ready(function () {

  // Get references to page elements
  var $workername = $("#workerName");
  var $workerSpecialty;
  var $hourlyrate = $("#hourlyRate");
  var $address = $("#workerAddress");
  var $phone = $("#workerPhone");
  var $rating = $("#workerRating");
  var $submitBtn = $("#submit");
  var $workerDistance = $("#workerDistance");
  var $workerImage = $("#workerImage");

  //Changes the display on the dropdown menu to whatever the user chose
  $('.dropdown-menu a').click(function () {
    $('#selected').text($(this).text());
  });

  //Using the npm validate package to check user input
  $("#formid").validate({
    errorClass: "errors",
    rules: {
      workerName: {
        required: true,
        minlength: 2
      },
      hourlyRate: {
        required: true,
        min: 10,
        max: 100
      },
      workerImage: {
        required: true
      },
      workerAddress: {
        required: true,
        minlength: 5
      },
      workerPhone: {
        required: true,
        minlength: 7
      },
      workerDistance: {
        required: true,
        min: 5,
        max: 100
      },
      workerRating: {
        required: true,
        min: 1,
        max: 5
      }
    },
    //List of messages to display depending on what validation requirements aren't being met by the user's current input
    messages: {
      workerName: {
        required: "Please enter a name",
        minlength: "Your name must be at least 2 characters long"
      },
      workerImage: {
        required: "Please attach a picture"
      },
      hourlyRate: {
        required: "Please enter your hourly rate",
        min: "You must enter at least 10",
        max: "You must enter less than 100"
      },
      workerAddress: {
        required: "Please enter your address",
        minlength: "You must enter your full address"
      },
      workerPhone: {
        required: "Please enter your phone number",
        minlength: "You must enter at least a 7 digit phone number"
      },
      workerDistance: {
        required: "Please enter the maximun number of miles you will travel for work",
        min: "You must enter a number greater than 5",
        max: "You must enter a number less than 100"
      },
      workerRating: {
        required: "You must enter your average rating",
        min: "The minimum rating is 1",
        max: "The maximum rating is 5"
      }
    }
  });


  //The API object contains methods for each kind of request we'll make
  var API = {
    saveWorker: function (worker) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "api/workers",
        data: JSON.stringify(worker)
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
    },
    getWorkers: function () {
      return $.ajax({
        url: "api/workers",
        type: "GET"
      });
    }
  };

  // handleFormSubmit is called whenever we submit a new example
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function () {
    $workerSpecialty = $("#selected").text();
    var worker = {
      name: $workername.val().trim(),
      image: $workerImage.val(),
      specialty: $workerSpecialty,
      hourly_rate: $hourlyrate.val(),
      address: $address.val().trim(),
      phone: $phone.val(),
      distance: $workerDistance.val(),
      rating: $rating.val()

    };
    //Alert to let the user know their information was successfully added to the database
    alert("You've been added as a new contractor!")


    API.saveWorker(worker).then(function () {
      refreshWorkers();
    });

    //Clears the form in case the user wants to add another person
    $workername.val("");
    $workerImage.val("");
    $hourlyrate.val("");
    $address.val("");
    $phone.val("");
    $workerDistance.val("");
    $rating.val("");

  };

  //Validation that prevents the form from being submitted if all of the required fields are not adequately filled in
  $("#formid").on("submit", function (event) {
    var isvalid = $("#formid").valid();
    if (isvalid) {
      event.preventDefault();
      handleFormSubmit();
    }
    else {
      alert("Please review the error messages before submitting the form")
    }
  });


  var handleAddReview = function (event) {
    event.preventDefault();

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
    $("#review-modal").modal("toggle");
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
      $("#review-modal").modal("toggle");

      alert("Thank you for your review.  We will contact you through email.");

      // calculate the new average rating for the contractor
      API.getReviews(currentId).then(function (result) {

        var total = 0;
        var numberOfReviews = result.length;
        for (var i = 0; i < numberOfReviews; i++) {
          total = total + result[i].rating;
        }

        var avgRating = total / numberOfReviews;
        var roundedAvg = Math.round(avgRating);

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

  $("#add-review").on("click", handleAddReview);

  $("#submit-review").on("click", handleSubmitReview);
  $("#cancel-review").on("click", handleCancelReview);
});