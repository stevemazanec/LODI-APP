var db = require("../models");
var NodeGeocoder = require("node-geocoder");

var options = {
  provider: "mapquest",
  httpAdapter: 'https',
  apiKey: process.env.MAPQUEST_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);


module.exports = function (app) {
  // Get all examples
  app.get("/api/workers", function (req, res) {
    db.Worker.findAll({}).then(function (dbWorkers) {
      res.json(dbWorkers);
    });
  });

  //Get workers by specialty
  app.get("/api/:specialty", function (req, res) {
    db.Worker.findAll({
      where: {
        specialty: req.params.specialty
      }
    }).then(function (dbWorkers) {
      res.json(dbWorkers);
    });
  });

  //Adding a new worker to the database
  app.post("/api/workers", function (req, res) {

    //Takes the address the user inputted and converts it to lattitude and longitude before passing it to the database
    geocoder.geocode(req.body.address, function (err, res) {
      var lat = res[0].latitude;
      var long = res[0].longitude;

      //Takes the number of miles the contractor indicated and converts them to meters so it can be used by the leaflet maps library
      var travelmeters = parseInt(req.body.distance * 1609.34);

      console.log(req.body);
      db.Worker.create({
        name: req.body.name,
        image: req.body.image,
        specialty: req.body.specialty,
        hourly_rate: req.body.hourly_rate,
        address: req.body.address,
        phone: req.body.phone,
        distance: travelmeters,
        rating: req.body.rating,
        latitude: lat,
        longitude: long
      });
    });
  });

  app.post("/api/reviews", function (req, res) {
    db.Review.create({
      comment: req.body.comment,
      rating: req.body.rating,
      email: req.body.email,
      workername: req.body.workername,
      WorkerId: req.body.WorkerId
    }).then(function (dbReview) {
      res.json(dbReview);
    });
  });

  // get all of the reviews for a contractor by id
  app.get("/api/getreviews/:id", function (req, res) {
    db.Review.findAll({
      where: {
        WorkerId: req.params.id
      },
      order: [
        ['rating', 'DESC']
      ]

    }).then(function (dbReviews) {
      res.json(dbReviews);
    });
  });



  // update the contractor's rating when a new review is added by a customer
  app.post("/api/updaterating/:id", function (req, res) {
    db.Worker.update({
      rating: req.body.rating
    }, {
        where: {
          id: req.params.id
        }

      }).then(function (dbWorker) {
        res.json(dbWorker);
      });
  });

};
