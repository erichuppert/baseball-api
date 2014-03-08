module.exports = function(app, connection) {

	// get atbats by query
	app.get('/atbats', function(req, res) {

		var pitcher = req.query.pitcher;
		var batter = req.query.batter;
		if (!pitcher && !batter ) {
			res.send(400, {message: "You must include a batter or pitcher in your search"})
		} else {
			var dateMin = req.query.dateMin;
			var dateMax = req.query.dateMax;
			var outcomes = req.query.outcomes;
			var venues = req.query.venues;
			var gameTypes = req.query.gameTypes;
			var orderBy = req.query.orderBy;

			sql = "SELECT atbat.* FROM atbat JOIN game ON atbat.game_id=game.id WHERE atbat.id IS NOT NULL";
			console.log('searching for atbats');
			console.log('pitcher: '+ pitcher);
			console.log('batter: '+ batter);
			if (pitcher) {
				sql += " AND pitcher=" + pitcher;
			}
			if (batter) {
				sql += " AND batter=" + batter;
			}
			if (dateMin) {
				sql += " AND game.datetime> '" +  dateMin + "'"; 
			}
			if (dateMax) {
				sql += " AND game.datetime< '" +  dateMax + "'"; 
			}
			if (outcomes) {
				sql += " AND event IN (" + "'" + outcomes.join("','") + "'" + ")";
			}
			if (venues) {
				sql += " AND game.venue_id IN (" + venues.join("','") + ")";
			}
			if (gameTypes) {
				sql += " AND game.game_type IN (" + "'" + gameTypes.join("','") + "'" + ")";
			}
			if (orderBy) {
				sql += " ORDER BY " + orderBy;
			} else {
				sql += " ORDER BY datetime desc"
			}
			sql += " LIMIT 20";	

			connection.query(sql, function(err, rows){
				if (err) {
					res.send(500, {status: "error", message: err})
				} else {
					res.send(200, rows);
				}
			})
			console.log('done search for atbats');
		}
	})
	app.get('/atbats/:id', function(req, res){
		var id = req.params.id;
		var atBatSql = "SELECT * FROM atbat WHERE id=" + id + " LIMIT 1";
		connection.query(atBatSql, function(err, rows){
			if (err){
				res.send(500, {
					status: "error",
					response: "err"
				});
				console.log(err);
			} else {
				if (rows) {
					atbatResponse = rows[0];
					// fetch picthes for this atbat
					pitchesSQL = "SELECT * FROM pitch WHERE atbat_id=" + id + " ORDER BY atbat_index asc";
					connection.query(pitchesSQL, function(err, rows){
						if (err) {
							res.send(500, {
								status: "error",
								response: "err"
							});
							console.log(err);
						} else {
							atbatResponse.pitches = rows;
							res.send(200, atbatResponse);
						}
					})
				} else {
					res.send(400, {status: 'error', message: 'There is no atbat with that ID'})
				}
			}
		}) 
	})
}