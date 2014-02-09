module.exports = function(app, connection) {

	// get atbats by query
	app.get('/atbats', function(req, res) {

		var pitcher = req.query.pitcher;
		var batter = req.query.batter;
		var dateMin = req.query.dateMin;
		var dateMax = req.query.dateMax;
		var outcomes = req.query.outcomes;
		var venues = req.query.venues;
		var gameTypes = req.query.gameTypes;
		var orderBy = req.query.orderBy;

		sql = "SELECT * FROM atbat JOIN game ON atbat.game_id=game.id WHERE id IS NOT NULL";

		console.log('pitcher: '+ pitcher);
		console.log('batter: '+ batter);
		if (pitcher || batter) {
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
				console.log(orderBy)
				sql += " ORDER BY " + orderBy;
			} else {
				sql += " ORDER BY datetime desc"
			}
		} else {
			res.json({message: 'You must include a pitcher or batter!'})
		}

		sql += " LIMIT 20";	

		console.log(sql);
		connection.query(sql, function(err, rows){
			res.end(JSON.stringify(rows));
		})
	})
}