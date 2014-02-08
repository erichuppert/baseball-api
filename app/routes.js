module.exports = function(app){ 
	// Connection test
	app.get('/ping', function(req, res){
		res.json(message: 'Success!')
	});

	var controllers = require('./controllers')(app);

}