var express = require("express"),
    bodyParser = require('body-parser'),
    mongo = require("mongodb"),
    mongoose = require("mongoose"),
    socketio = require("socket.io"),
    cookieParser = require("cookie-parser"),
    http = require("http"),
    fs = require("fs"),
    multer  = require('multer'),

    db = require('./config/config.js').database,
    server = require('./config/config.js').server,

    modelPath = __dirname + '/models',
    modelFiles = fs.readdirSync(modelPath),
    routePath = __dirname + '/routes',
    routeFiles = fs.readdirSync(routePath),
    socketPath = __dirname + '/sockets',
    socketFiles = fs.readdirSync(socketPath);

var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var folderID = generateID();
        fs.mkdirSync('./uploads/'+ folderID);
        cb(null, './uploads/' + folderID + '/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

function generateID() {
    var ID = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 20; i++ )
        ID += possible.charAt(Math.floor(Math.random() * possible.length));
    return ID;
}

var upload = multer({ storage: storage });

app.use(express.static('../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// VOOR HET GEVAL DAT JE DE ERROR 'REQUEST ENTITY TOO LARGE' KRIJGT
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());

modelFiles.forEach(function(file){
    require(modelPath + '/' + file);
});

routeFiles.forEach(function(file){
    require(routePath + '/' + file)(app);
});

socketFiles.forEach(function(file){
    require(socketPath + '/' + file)(io, app, upload);
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