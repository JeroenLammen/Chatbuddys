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
            console.log(doc);
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
            console.log(doc);
    });
};

//------------------------------------------------------------------
//------------------------------------------------------------------

exports.create = function(req,res){
    console.log("create controller");
    var message = new Message(req.body);
    message.save(function(err){
        if(err) {
            handleError(err);
            res.send(err);
        } else {
            console.log("message saved:");
            console.log(message);
            return res.send(message);
        }
    });
};

//------------------------------------------------------------------
//------------------------------------------------------------------

function handleError(err){
    delete err.stack;
    for(var prop in err.errors){
        console.log(prop);
        delete err.errors[prop].stack;
    }
    return err;
}