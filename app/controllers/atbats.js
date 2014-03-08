module.exports = function(app, connection) {

	// get atbats by query
	app.get('/atbats', function(req, res) {

		var pitcher = req.query.pitcher;
		var batter = req.query.batter;
		if (!pitcher || !batter ) {
			res.send(400, {message: "You must include a batter and pitcher in your search"})
		} else {
			var dateMin = req.query.dateMin;
			var dateMax = req.query.dateMax;
			var outcomes = req.query.outcomes;
			var venues = req.query.venues;
			var gameTypes = req.query.gameTypes;
			var orderBy = req.query.orderBy;
			var limit = req.query.limit;

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
			if (limit) {
				sql += " LIMIT" + limit;
			} else {
				sql += " LIMIT 20";	
			}

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
	
	app.get('/atbats/stats', function(req, res) {

		var pitcher = req.query.pitcher;
		var batter = req.query.batter;
		if (!pitcher || !batter ) {
			res.send(400, {message: "You must include a batter and pitcher in your search"})
		} else {
			var dateMin = req.query.dateMin;
			var dateMax = req.query.dateMax;
			var outcomes = req.query.outcomes;
			var venues = req.query.venues;
			var gameTypes = req.query.gameTypes;
			var orderBy = req.query.orderBy;
			var limit = req.query.limit;

			sql = "SELECT atbat.event, COUNT(*) as count FROM atbat JOIN game ON atbat.game_id=game.id WHERE atbat.id IS NOT NULL";
			console.log('getting matchup stats');
			console.log('pitcher: '+ pitcher);
			console.log('batter: '+ batter);
			if (pitcher) {
				sql += " AND atbat.pitcher=" + pitcher;
			}
			if (batter) {
				sql += " AND atbat.batter=" + batter;
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

			sql += " GROUP BY atbat.event";

			connection.query(sql, function(err, rows){
				if (err) {
					res.send(500, {status: "error", message: err})
				} else {
					var statsNeeded = {singles: 0, doubles: 0, triples: 0, homeruns: 0, walks: 0};
					var paCount = 0;
					for (var i=0; i<rows.length;i++) {
						stat = rows[i];
						if (stat.event != 'Runner Out') {
							paCount += stat.count;
							var label = stat.event.toLowerCase().replace(/\s+/g, '') + 's';
							if (label in statsNeeded) {
								statsNeeded[label] = stat.count;
							}
						}
					};
					statsNeeded['plateAppearances'] = paCount;	
					res.send(200, statsNeeded);
				}
			})
			console.log('done getting atbat stats');
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