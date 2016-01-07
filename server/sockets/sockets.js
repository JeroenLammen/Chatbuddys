module.exports = function(io, app, upload) {

    var controllers = require("../controllers/messages.js");
    var usersOnline = [];

    io.on("connection", function(socket) {

    //----------------------------------------------------------------
    //  USERS
    //----------------------------------------------------------------

        socket.on("newUser", function(user) {
            socket.emit("userList", usersOnline);
            var userObj = {
                userID: user.id,
                socketID: socket.id,
                username: user.username
            };
            usersOnline.push(userObj);
            console.log(usersOnline);
            socket.broadcast.emit("newUser", userObj);
        });

        socket.on("disconnect", function() {
            var index = getIndexOfObject(usersOnline, "socketID", socket.id);
            if(index > -1) {
                socket.broadcast.emit("disconnectedUser", usersOnline[index]);
                usersOnline.splice(index, 1);
            }
        });

    //----------------------------------------------------------------
    //  MESSAGES
    //----------------------------------------------------------------

        socket.on("sendMessage", function(message){

            var index = getIndexOfObject(usersOnline, "socketID", socket.id);
            message.author = usersOnline[index].username;
            message.authorID = usersOnline[index].userID;
            message.date = new Date();

            controllers.add(message, socket, io);
        });

        socket.on("typing", function(name){
            var index = getIndexOfObject(usersOnline, "socketID", socket.id);
            socket.broadcast.emit("userIsTyping", usersOnline[index]);
        });

        socket.on("stoppedTyping", function(name){
            var index = getIndexOfObject(usersOnline, "socketID", socket.id);
            socket.broadcast.emit("userStoppedTyping", usersOnline[index]);
        });
    });

    app.post('/uploads', upload.single('file'), function (req, res, next) {
        var index = getIndexOfObject(usersOnline, "userID", req.body.id);
        var message = {};
        message.author = usersOnline[index].username;
        message.authorID = usersOnline[index].userID;
        message.body = 'File:';
        message.filePath = req.file.destination + req.file.originalname;
        message.fileName = req.file.originalname;
        message.date = new Date();
        console.log(req.file);
        controllers.addFile(message, req, res, io);
    });


};

function getIndexOfObject(array, property, value) {
    for(var i = 0; i < array.length; i++) {
        if (array[i][property] === value) {
            return i;
        }
    }
    return -1;
}