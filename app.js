/// <reference path="./typings/tsd.d.ts" />
var UserModel_1 = require('./DBRepo/UserModel');
var GeneralRoutes = require('./routes/general');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
app.set('port', 3000);
var staticDir = path.resolve(__dirname, './static');
app.use(express.static(staticDir));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    if (req.query.token) {
        UserModel_1.findUser({ FirebaseToken: req.query.token })
            .then(function (dbUser) {
            if (dbUser) {
                req.user = dbUser;
                next();
            }
        }, function (err) {
            next(err);
        });
    }
    else {
        next();
    }
});
app.use('/api', GeneralRoutes);
app.get('*', function (req, res) {
    var indexFilePath = path.resolve(__dirname, './static/adminPortal/index.html');
    res.sendFile(indexFilePath);
});
app.listen(app.get('port'), function () {
    console.log('Server is running on port ' + app.get('port'));
});
mongoose.connect('mongodb://localhost/data');
