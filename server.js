var express = require('express');
var mysql = require('mysql');
var app = express();

// intitialize database connection
var database = require('./config/database');
var connection = mysql.createConnection(database);
connection.query('USE baseball');

var routes = require('./app/routes')(app);

app.listen(3000);
console.log('Listening on port 3000');