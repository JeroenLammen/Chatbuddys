var express = require("express");
var bodyParser = require('body-parser');
var mongo = require("mongodb");
var mongoose = require("mongoose");
var socketio = require("socket.io");
var http = require("http");

var app = express();
var httpServer = http.Server(app);
var io = socketio(httpServer);

app.use(express.static('../client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

///
//app.all('*', function(req, res) {
//    res.redirect("/");
//});

io.on('connection', function(socket){

    socket.on('disconnect', function(){

    });

    socket.on("connected", function() {

    });
});

httpServer.listen(3000, '0.0.0.0');
console.log("Server listening on port 3000 ");