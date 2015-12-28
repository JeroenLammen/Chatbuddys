var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    author: {type: String, required: true},
    body: {type: String, required: true},
    file: {type: String},
    date: {type: Date, default: Date.now}
});

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;