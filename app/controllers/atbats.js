module.exports = function(app, connection) {

	// 
	app.get('/atbats', function(req, res) {
		res.writeHead(200, {'Content-Type': 'application/json'});

		var pitcher = req.params.pitcher;
		var batter = req.params.batter;
		var dateMin = req.params.dateMin;
		var dateMax = req.params.dateMax;
		var outcome = req.params.outcome;
		var venue = req.params.venue;
		var gameType = req.params.gameType;
		var orderBy = req.params.orderBy;

		sql = "SELECT * FROM atbat JOIN game ON atbat.game_id=game.id WHERE id IS NOT NULL";

		if (pither || batter) {
			if (pitcher) {
				sql += " AND picther=" + pitcher;
			}
			if (batter) {
				sql += " AND batter=" + batter;
			}
			if (dateMin) {
				sql += " AND game.datetime>" + dateMin;
			}
			if (outcome) {
				sql += " AND event='" + outcome + "'";
			}
			if (venue) {
				sql += " AND game.venue IN (" + venue.join(",") + ")";
			}
			if (gameType) {
				sql += " AND game.game_tpye IN (" + gameType.join(",") + ")";
			}
			if (orderBy) {
				sql += " ORDER BY " + orderBy;
			}
		} else {
			res.json({message: 'You must include a pitcher or batter!'})
		}

		sql += "LIMIT 20"

		connection.query(sql, function(err, rows){
			res.end(JSON.stringigy(rows));
		})
	)}
}