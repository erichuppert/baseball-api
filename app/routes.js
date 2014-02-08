// 
app.get('/ping', function(req, res){
	res.json(message: 'Success!')
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