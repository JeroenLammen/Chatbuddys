var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    authorID: {type: String, required: true},
    author: {type: String, required: true},
    body: {type: String},
    fileName: {type: String},
    filePath: {type: String},
    date: {type: Date, default: Date.now}
});

messageSchema.path('body').validate(function(val) {
    return (val !== undefined && val !== null);
}, "incorrect message");

//messageSchema.path('body').validate(function(val) {
//   if(messageSchema.path("filePath").validate(function(val){
//       return (val !== undefined && val !== null);
//   }, false)) {
//       return true;
//   } else {
//       return (val !== undefined && val !== null);
//   }
//}, "incorrect message");

var Message = mongoose.model("Message", messageSchema);

module.exports = Message;