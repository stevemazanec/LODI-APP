var db = require("../models");

module.exports = function (app) {
  // Load home page
  app.get("/", function (req, res) {
    res.render("index", {
      //Updates the title in the header section
      pagetitle: "Home",
      css: "cssgrid.css",
      js: "index.js"
    });
  });

  app.get("/contactus", function (req, res) {
    res.render("contactus", {
      pagetitle: "Contact Us",
      css: "contactcss.css",
      js: "contact.js"
    });
  });

  //Load page to add a new contractor to the database
  app.get("/addcontractor", function (req, res) {
    res.render("contractor", {
      pagetitle: "Add Contractor",
      css: "contractor.css",
      js: "contractor.js"
    });
  });

  app.get("/reviews", function (req, res) {
    db.Worker.findAll({}).then(function (dbWorkers) {
      res.render("reviews", {
        pagetitle: "Reviews",
        css: "review.css",
        js: "review.js",
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
        css: "roofing.css",
        js: "roofing.js",
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
        css: "windows.css",
        js: "windows.js",
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
        css: "plumbing.css",
        js: "plumbing.js",
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
        css: "painting.css",
        js: "painting.js",
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
        css: "landscaping.css",
        js: "landscaping.js",
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
        css: "flooring.css",
        js: "flooring.js",
        floorers: dbWorkers
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};