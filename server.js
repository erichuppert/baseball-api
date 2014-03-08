var express = require('express');
var mysql = require('mysql');
var app = express();

// intitialize database connection
var config = require('./config.js');
var connection = mysql.createConnection(config.database.credentials);
connection.query('use ' + config.database.name);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', null);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.configure(function() {
    app.use(allowCrossDomain);
});

var routes = require('./app/routes')(app, connection);

app.listen(3000);
console.log('Listening on port 3000');