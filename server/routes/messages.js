module.exports = function(app) {

    var messages = require("../controllers/messages.js");

    //message_id will be available in the controller with req.params.message_id
    //app.get("/chat/:message_id", messages.getOne);

    app.get("/chat", messages.getAll);

    app.post("/chat", messages.add);

    app.delete("/chat", messages.delete);

};