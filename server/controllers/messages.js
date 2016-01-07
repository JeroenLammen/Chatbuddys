var mongoose = require("mongoose");
var Message = mongoose.model("Message");

exports.getOne = function(req, res){

    console.log("getOne controller");

    // get document with matching ID
    var conditions = {_id: req.params.message_id};
    // get all fields from the document
    var fields = {};

    Message
        .findOne(conditions, fields)
        .exec(function(err, doc){
            if (err) res.send(err);
            res.send(doc);
    });
};

//------------------------------------------------------------------
//------------------------------------------------------------------

exports.getAll = function(req, res){

    console.log("getAll controller");

    // get all documents
    var conditions = {};
    // get all fields from the document
    var fields = {};

    Message
        .find(conditions, fields)
        .sort({date: 'desc'})
        .exec(function(err, doc){
            if (err) res.send(err);
            res.send(doc);
    });
};

//------------------------------------------------------------------
//------------------------------------------------------------------

exports.add = function(message, socket, io){

    console.log("create controller");

    var correctMessage = checkMessage(message);
    if(correctMessage) {
        console.log("correct message");
        var document = new Message(message);
        console.log(document);
        document.save(function (err) {
            if(err){
                handleError(err);
                console.log("HALLO FOUTMELDING HIERO");
                console.log(err);
                //SHOULD EMIT ANOTHER ERROR MESSAGE, EVEN THOUGH THIS WOULD PROBABLY NEVER RUN
            } else {
                console.log("message saved");
                io.sockets.emit("message", document);
            }
        });
    } else {
        console.log("incorrect message");
        // don't use "error" as the name of the socket message,
        // took me forever to find out why it wouldn't work
        socket.emit("incorrectMessage", "empty username and/or message");
    }
};

exports.addFile = function(message, req, res, io) {

    var correctmessage = checkFile(message);
    if(correctmessage) {
        var document = new Message(message);
        document.save(function (err) {
            if(err){
                handleError(err);
            } else {
                io.sockets.emit("message", document);
                res.send("uploaded!")
            }
        })
    } else {
        res.send("incorrect message");
    }

};

//------------------------------------------------------------------
//------------------------------------------------------------------

exports.delete = function(req,res) {
    Message
        .remove({}, function(err) {
            if(err){
                throw err;
            } else {
                console.log("documents deleted");
                res.send("all documents deleted");
            }
        });
};

//------------------------------------------------------------------
//------------------------------------------------------------------

// this function validates the given message
function checkMessage(message){
    if(
        !message.body ||
        !message.author ||
        typeof message.author !== 'string' ||
        typeof message.body !== 'string'
    ) {
        return false;
    } else {
        return true;
    }
}

function checkFile(message){
    if(
        !message.filePath ||
        !message.author ||
        typeof message.author !== 'string' ||
        typeof message.filePath !== 'string'
    ) {
        return false;
    } else {
        return true;
    }
}

// this function deletes some unnecessary info from the error object to make it more readable
function handleError(err){
    delete err.stack;
    for(var prop in err.errors){
        if(err.errors.hasOwnProperty(prop)) {
            delete err.errors[prop].stack;
        }
    }
    return err;
}