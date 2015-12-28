var express = require("express"),
    bodyParser = require('body-parser'),
    mongo = require("mongodb"),
    mongoose = require("mongoose"),
    socketio = require("socket.io"),
    cookieParser = require("cookie-parser"),
    http = require("http"),
    fs = require("fs"),

    db = require('./config/config.js').database,
    server = require('./config/config.js').server,

    modelPath = __dirname + '/models',
    modelFiles = fs.readdirSync(modelPath),
    routePath = __dirname + '/routes',
    routeFiles = fs.readdirSync(routePath);
    socketPath = __dirname + '/sockets',
    socketFiles = fs.readdirSync(socketPath);

var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);

app.use(express.static('../client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

modelFiles.forEach(function(file){
    require(modelPath + '/' + file);
});

routeFiles.forEach(function(file){
    require(routePath + '/' + file)(app);
});

socketFiles.forEach(function(file){
    require(socketPath + '/' + file)(io);
});

mongoose.connect(db.getURL());

mongoose.connection.on('open', function () {
    console.log("Successfully connected to database: " + db.database);
});
mongoose.connection.on('error', function (error) {
    console.log("Error connecting to database: " + db.database);
    console.log(error);
});

//this file is used to experiment
require("./experiments/experiments")(app);

//load index.html for every request that has not been defined
//Angular.js will handle the route and show a 404 page if the route does not exist
app.use('/*', function(req, res){
    res.sendFile('client/index.html', {root: '../'});
});

httpServer.listen(server.port, server.ip);
console.log("Server listening on port " + server.port);