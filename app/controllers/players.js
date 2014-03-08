module.exports = function(app, connection) {

	// get players from query string
	app.get('/players', function(req, res){
		var name = req.query.name;
		if (name) {
			var sql = "SELECT * FROM player WHERE CONCAT(first, ' ', last) LIKE '%" + name + "%' LIMIT 10";
			connection.query(sql, function(err, rows){
				res.send(200, rows);
			})	
		}
	});

	// get player by id
	app.get('/players/:id', function(req, res){
		var id = req.params.id;
		var sql = "SELECT * FROM player WHERE id=" + id + " LIMIT 1"
		connection.query(sql, function(err, rows){
			if (rows) {
				var player = rows[0];
				console.log(player);
				res.send(200, player);
			} else {
				res.send(400, {status: 'error', message: 'There is no player with that ID'});
			}
		})
	});
}