module.exports = function(app){ 
	// Connection test
	app.get('/ping', function(req, res){
		res.json({message: 'Success!'})
	});

	var players = require('./controllers/players')(app);

}