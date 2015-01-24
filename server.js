var http = require('http');
var express = require("express");
var app = express();
//var ejsEngine = require("ejs-locals");
var controllers = require("./controllers");
var flash = require("connect-flash");

//setup the view engine:
//jade//
//app.set("view engine", "jade");
//ejs//
//app.engine("ejs", ejsEngine); //supports master pages
//app.set("view engine", "ejs"); //ejs view engine
//vash//
app.set("view engine", "vash");

//opt in to Services:
app.use(express.urlencoded());
app.use(express.json());
app.use(express.cookieParser()); //Express 4+ needs cookie-parser installed separately
app.use(express.session({ secret: "CapacitiveBoard" }));
app.use(flash());

//set the public static resource folder:
app.use(express.static(__dirname + "/public"));

//vash
//map the routes:
controllers.init(app);

//not unlike ASP.NET WebApi - 1st param is the route, 2nd is the HTTP method:
app.get("/api/users", function (req, res) {
    res.set("Content-Type", "application/json");
    res.set("Service-Provider", "capacitive.ca");
    res.send({user: "Mark", id: 1138, loggedOn: true});
});

var server = http.createServer(app);
server.listen(1029);

var updater = require("./updater");
updater.init(server);

