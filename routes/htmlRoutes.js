var db = require("../models");

module.exports = function (app) {
  // Load home page
  app.get("/", function (req, res) {
    res.render("index", {
      //Updates the title in the header section
      pagetitle: "Home"
    });
  });

  app.get("/contactus", function (req, res) {
    res.render("contactus", {
      pagetitle: "Contact Us"
    });
  });

  //Load page to add a new contractor to the database
  app.get("/addcontractor", function (req, res) {
    res.render("contractor", {
      pagetitle: "Add Contractor"
    });
  });

  app.get("/reviews", function (req, res) {
    db.Worker.findAll({}).then(function (dbWorkers) {
      res.render("reviews", {
        pagetitle: "Reviews",
        workers: dbWorkers
      });
    });
  });

  //Loads all of the workers with Roofing specialty and adds them to the roofing handlebars page
  app.get("/roofing", function (req, res) {
    console.log(req.body);
    db.Worker.findAll({
      where: {
        specialty: "Roofing"
      }
    }).then(function (dbWorkers) {
      res.render("roofing", {
        pagetitle: "Roofers",
        roofers: dbWorkers
      });
    });
  });

  app.get("/windows", function (req, res) {
    db.Worker.findAll({
      where: {
        specialty: "Windows"
      }
    }).then(function (dbWorkers) {
      res.render("windows", {
        pagetitle: "Windows",
        windows: dbWorkers
      });
    });
  });

  app.get("/plumbing", function (req, res) {
    db.Worker.findAll({
      where: {
        specialty: "Plumbing"
      }
    }).then(function (dbWorkers) {
      res.render("plumbing", {
        pagetitle: "Plumbers",
        plumbers: dbWorkers
      });
    });
  });

  app.get("/painting", function (req, res) {
    db.Worker.findAll({
      where: {
        specialty: "Painting"
      }
    }).then(function (dbWorkers) {
      res.render("painting", {
        pagetitle: "Painters",
        painters: dbWorkers
      });
    });
  });

  app.get("/landscaping", function (req, res) {
    db.Worker.findAll({
      where: {
        specialty: "Landscaping"
      }
    }).then(function (dbWorkers) {
      res.render("landscaping", {
        pagetitle: "Landscapers",
        landscapers: dbWorkers
      });
    });
  });

  app.get("/flooring", function (req, res) {
    db.Worker.findAll({
      where: {
        specialty: "Flooring"
      }
    }).then(function (dbWorkers) {
      res.render("flooring", {
        pagetitle: "Flooring",
        floorers: dbWorkers
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
