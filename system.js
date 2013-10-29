
var express  = require('express')
  , app      = express()
  , mongoose = require('mongoose')
  , fs       = require('fs')
  , Talent   = require('./models/talent')
  ;

mongoose.connect('localhost', 'dsa'); 
mongoose.connection.on('error', function _error(err) {
	console.log('Mongoose error: ' + err);
});
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		process.exit(0);
	});
});
app.set('port', process.env.PORT || 8080);  // ENV values from the Windows ENV
app.use(express.logger('dev'));
app.use(express.compress());              // gzip/deflate
app.use(express.bodyParser());            // parse POST data into req.body

app.get('/', function (req, res, next) {
	res.send('Nothing to do.');
});
app.get('/setup', function (req, res, next) {
	fs.readFile('./data/dsa-talente.json', { encoding: 'utf-8' }, function(err, data) {
		if (err) return next(err);
		Talent.create(JSON.parse(data), function(err, docs) {
			if (err) return next(err);
			res.end(docs.length + " data sets have been saved.");
		});
	});
});
app.get('/list', function (req, res, next) {
	Talent
		.find()
		.lean()
		.exec(function (err, docs) {
			if (err) return next(err);
			res.setHeader('Content-Type: text/plain; charset=utf-8');
			res.send(JSON.stringify(docs));
	});
});

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});