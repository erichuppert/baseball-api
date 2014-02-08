var express = require('express');
var mysql = require('mysql');
var app = express();

// intitialize database connection
var database = require('./config/database');
var connection = mysql.createConnection(database);
connection.query('USE baseball');


app.get('/ping', function(req, res){
	res.send('Success! You are connected.')
});

// get player info
app.get('/players', function(req, res){
	var name = req.query.name;
	if (name) {
		var sql = "SELECT * FROM player WHERE CONCAT(first, ' ', last) LIKE '%" + name + "%' LIMIT 10";
		connection.query(sql, function(err, rows){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(rows));
		})	
	}
})

app.listen(3000);
console.log('Listening on port 3000');