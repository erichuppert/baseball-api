	module.exports = function(app, connection) {

	// get players from query string
	app.get('/players', function(req, res){
		var name = req.query.name;
		var positionType = req.query.positionType;
		if (name) {
			var sql = "SELECT * FROM player WHERE CONCAT(first, ' ', last) LIKE '%" + name + "%'";
			if (positionType === 'pitcher') {
				sql += " AND throws IS NOT NULL";
			} else if (positionType === 'batter') {
				sql +=  " AND bats IS NOT NULL";
			}
			sql += " LIMIT 10"
			connection.query(sql, function(err, rows){
				if (err) {
					res.send(500, {status: 'error', message: err});
					console.log(err);
				} else {
					res.send(200, rows);
				}
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