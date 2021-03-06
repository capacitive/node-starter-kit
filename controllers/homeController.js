﻿(function (homeController) {

    var data = require("../data");

    homeController.init = function(app) {
        app.get("/", function (req, res) {
            //res.send("<html><body><h1>Express</h1></body></html>");//raw html when no view engine available
            data.getNoteCategories(function (err, results) {
                res.render("index", {
                    title: "The Board", 
                    error: err, 
                    categories: results,
                    newCatError: req.flash("newCatName")
                });
            });      
        });

        app.get("/notes/:categoryName", function(req, res) {
            var categoryName = req.params.categoryName;
            res.render("notes", { title: categoryName });
        });


        app.post("/newCategory", function(req, res) {
            var categoryName = req.body.categoryName;
            data.createNewCategory(categoryName, function (err) {
                if (err) {
                    console.log("error inserting new category");
                    req.flash("newCatName", err);
                    res.redirect("/");
                } else {
                    res.redirect("/notes/" + categoryName);
                }
            });
        });
    };
})(module.exports);