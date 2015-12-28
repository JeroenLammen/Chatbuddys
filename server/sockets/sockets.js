module.exports = function(io) {

    var messages = require("../controllers/messages.js");

    io.on("connection", function(socket){
        socket.on("sendMessage", function(message){
            console.log("----- " + message.body + " -----");
            messages.add(message, socket, io);
        });
    });
};