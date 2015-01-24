(function (data) {
    var seedData = require("./seedData");
    var database = require("./database");

    data.getNoteCategories = function(next) {
        database.getDb(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                //filter query { name: "People" }
                //filter on note count { notes: { $size: 5 } }
                //inverse of above { notes: { $not: { $size: 5 } } }
                //sort .sort({ name: 1 })
                //inverse sort order .sort({ name: -1 })
                db.notes.find().sort({ name: -1 }).toArray(function (err, results) { 
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

    data.createNewCategory = function (categoryName, next) {
        database.getDb(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find({ name: categoryName }).count(function(err, count) {
                    if (err) {
                        next(err, null);
                    } else {
                        if (count != 0) {
                            console.log("Category " + categoryName + " already exists.");
                            next("Category already exists.");
                        } else {
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.notes.insert(cat, function (err) {
                                console.log("inserting...");
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };

    data.getNotes = function(categoryName, next) {
        database.getDb(function(err, db) {
            if (err) {
                console.log("failed to seed database: " + err);
            } else {
                db.notes.findOne({name: categoryName}, next);
            }
        });
    };
    
    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("failed to seed database: " + err);
            } else {
                db.notes.update({ name: categoryName }, { $push: { notes: noteToInsert} }, next);
            }
        });
    };

    function seedDatabase() {
        database.getDb(function(err, db) {
            if (err) {
                console.log("failed to seed database: " + err);
            } else {
                //test to see if data exists:
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("failed to retrieve a database count");
                    } else {
                        if (count == 0) {
                            console.log("seeding database...");
                            seedData.initialNotes.forEach(function(item) {
                                db.notes.insert(item, function(err) {
                                    if (err) console.log("failed to insert note");
                                });
                            });
                        } else {
                            console.log("database already seeded.");
                        }
                    }
                });
            }
        });
    };

    seedDatabase();

})(module.exports);