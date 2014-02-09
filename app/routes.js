module.exports = function(app, connection){ 
	// Connection test
	app.get('/ping', function(req, res){
		res.json({message: 'Success!'})
	});

	var players = require('./controllers/players')(app, connection);
	var atbats = require('./controllers/atbats')(app, connection)

}