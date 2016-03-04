module.exports = function(app) {

    var messages = require("../controllers/messages.js");

    app.get("/chat", messages.getAll);

    app.post("/chat", messages.add);

    app.delete("/chat", messages.delete);

    app.get("/uploads/:filePath/:file", function(req, res, next) {
        res.sendFile("uploads/" + req.params.filePath + "/" + req.params.file, {root: "../server/"});
    })

};