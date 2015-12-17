module.exports = function(app){

    app.use(function(req,res,next){
        console.log(req.method);
        next();
    });

    //app.all('*', function(req, res) {
    //    res.redirect("/");
    //});

    //app.param('id', function (req, res, next, value) {
    //    res.send(value);
    //});

    app.get('/test/:id', function(req,res, next){
        res.send('/test/' + req.params.id);
    });

    app.get('/p', function(req, res) {
        // GET /p?tagId=5
        // tagId is set to 5
        res.send("tagId is set to " + req.query.tagId);

        //res.send(req.query);
        //res.send(req.ip);

    });

};
