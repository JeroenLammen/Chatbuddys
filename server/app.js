var express = require("express"),
    bodyParser = require('body-parser'),
    mongo = require("mongodb"),
    mongoose = require("mongoose"),
    socketio = require("socket.io"),
    http = require("http"),
    fs = require("fs"),

    db = require('./config/config.js').database,
    server = require('./config/config.js').server,

    modelPath = __dirname + '/models',
    modelFiles = fs.readdirSync(modelPath),
    routePath = __dirname + '/routes',
    routeFiles = fs.readdirSync(routePath);

var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);

app.use(express.static('../client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

modelFiles.forEach(function(file){
    require(modelPath + '/' + file);
});

routeFiles.forEach(function(file){
    require(routePath + '/' + file)(app);
});

mongoose.connect(db.getURL());

mongoose.connection.on('open', function () {
    console.log("Successfully connected to database: " + db.database);
});
mongoose.connection.on('error', function (error) {
    console.log("Error connecting to database: " + db.database);
    console.log(error);
});

require("./experiments/experiments")(app);

io.on('connection', function(socket){
    socket.on('disconnect', function(){

    });
});

httpServer.listen(server.port, server.ip);
console.log("Server listening on port " + server.port);