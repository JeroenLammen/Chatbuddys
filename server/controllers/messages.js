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
//OLD CREATE FUNCTION FOR GET REQUEST ON /CHAT, USING SOCKETS NOW

//exports.create = function(req,res){
//    console.log("create controller");
//    var message = new Message(req.body);
//    message.save(function(err){
//        if(err) {
//            handleError(err);
//            res.send(err);
//        } else {
//            console.log("message saved:");
//            console.log(message);
//            return res.send(message);
//        }
//    });
//};

exports.add = function(message, socket, io){

    console.log("create controller");

    var correctMessage = checkMessage(message);
    if(correctMessage) {
        console.log("correct message");
        var document = new Message(message);
        document.save(function (err) {
            if(err){
                handleError(err);
                console.log(err);
            } else {
                console.log("message saved");
                io.sockets.emit("message", document);
            }
        });
    } else {
        console.log("incorrect message");
        // don't use "error" as the name of the socket message,
        // took me forever to find out why it wouldn't work
        socket.emit("incorrect", "empty username and/or message");
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

function checkMessage(message){
    if(!message.body || !message.author || typeof message.author !== 'string' || typeof message.body !== 'string'){
        return false;
    } else {
        return true;
    }
}

// same function as above, except this function checks the message the other way around
// (it returns false if the message is correct and true if message is incorrect.)
// When calling this function instead of the above one, use ! for the output, for example:
// if(!checkMessage(myMessage)){ // correct } else { //incorrect }
//    ^ important
//function checkMessage(message){
//    return !message.author ||
//        !message.body ||
//        typeof message.author !== 'String' ||
//        typeof message.body !== 'String';
//}

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