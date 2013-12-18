var express  = require('express')
  , app      = express()
  , path     = require('path')
  , http     = require('http')
  , mongoose = require('mongoose')
  , fs       = require('fs')
  , Talent   = require('./models/talent')
  , data     = require('./data/dsa')
  ;

app.set('port', process.env.PORT || 1337);  // ENV values from the Windows ENV
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/Favicon_Chromatrix.png'));
app.use(express.logger('dev'));
app.use(express.compress());              // gzip/deflate
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());        // use PUT/DELETE
app.use(app.router);                      // calls routes before static
app.use(express.static(path.join(__dirname, 'public'))); // serve static files
app.use(function(req, res) {
	res.status(404).render('error-message', {
		title: '404: File Not Found', 
		message: 'Sorry, there is no such page "' + req.originalUrl + '"'
	});
});
app.use(function(error, req, res, next) {
	var status = res.statusCode < 400 ? 500 : res.statusCode;
	//console.log(error.stack)
	res.status(status).render('error-message', {
		title: 'Error ' + status + ': ' + http.STATUS_CODES[status], 
		message: error.message || error
	});
});
app.locals.pretty = true;

mongoose.connect('mongodb://localhost/dsa'); 
// watch DB events
mongoose.connection.on('error', function _error(err) {
	console.log('Mongoose error: ' + err);
});
mongoose.connection.on('connected', function _connected() {
	console.log('Mongoose connected to DB ' + this.host + ':' + this.port+ '/' + this.name);
});
mongoose.connection.on('disconnected', function _disconnected() {
	console.log('Mongoose connection closed');
});
// kill connection on application end
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose connection terminated');
		process.exit(0);
	});
});

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