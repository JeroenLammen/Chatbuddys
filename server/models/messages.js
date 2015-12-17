var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    author: {type: String, required: true},
    body: {type: String, required: true},
    file: {type: String},
    //post expires after 1 hour (6*60 seconds) just for testing
    date: {type: Date, default: Date.now, expires: 6*60}
});

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;