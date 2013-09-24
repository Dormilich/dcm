
/***********************
 *  Load Dependencies  *
 ***********************/
var express  = require('express')
  , app      = express()
  , path     = require('path')
  , http     = require('http')
  , mongoose = require('mongoose')
  ;
/***********************************
 *  Configure Express Application  *
 ***********************************/

app.set('port', process.env.PORT || 8080);  // ENV values from the Windows ENV
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());              // gzip/deflate
app.use(express.bodyParser());            // parse POST data into req.body
app.use(express.methodOverride());        // use PUT/DELETE
app.use(app.router);                      // calls routes before static
app.use(express.static(path.join(__dirname, 'public'))); // serve static files
/* Handle 404
	 this is middleware, not an error handler. 
	 if all previous routes/files failed, this is the response being sent.
 */
app.use(function(req, res) {
	res.status(404).render('error-message', {
		title: '404: File Not Found', 
		message: 'Sorry, there is no such page "' + req.originalUrl + '"'
	});
});
// Handle errors
app.use(function(error, req, res, next) {
	var status = res.statusCode < 400 ? 500 : res.statusCode;
	res.status(status).render('error-message', {
		title: 'Error ' + status + ': ' + http.STATUS_CODES[status], 
		message: error.message || error
	});
});
app.locals.pretty = true;

/**********************************
 *  Connect to and Watch MongoDB  *
 **********************************/

mongoose.connect('localhost', 'dsa'); 
// watch DB events
mongoose.connection.on('error', function _error(err) {
	console.log('Mongoose error: ' + err);
});
// kill connection on application end
process.on('SIGINT', function() {
	mongoose.connection.close(function () {
		console.log('Mongoose connection disconnected through app termination');
		process.exit(0);
	});
});

/************************
 *  Define HTTP Routes  *
 ************************/

var Talent = require('./models/talent');

// pre-route request modification
app.param('mongo', function (req, res, next, id) {
	if (!/^[0-9a-fA-F]+$/.test(id)) {
		return next(new Error("Keine gültige MongoDB ID."));
	}
	Talent
		.findById(id)
		.exec(function(error, doc) {
			if (error) {
				next(error);
			}
			else if (doc) {
				req.talent = doc;
				next();
			}
			else {
				res.statusCode = 404;
				next(new Error("Kein Datensatz gefunden."));
			}
		});
});
function verifyMongoID(identifyer) {
	return function (req, res, next) {
		if (!/^[0-9a-fA-F]+$/.test(req.params[identifyer])) {
			return next(new Error("Keine gültige MongoDB ID."));
		}
		req.id = req.params[identifyer];
		next();
	}
}

app.get('/', function(req, res, next) {
	Talent
		.find()
		.sort('typ name')
		.lean()
		.exec(function(err, docs) {
			if (err) return next(err);
			res.render('table-of-talents', { Liste: docs });
		})
	;
});

app.get('/talent/:mongo', function(req, res, next) {
	Talent
		.find()
		.lean()
		.distinct('typ', function(err, docs) {
			if (err) return next(err);
			req.talent.kategorie = docs;
			res.render('edit-talent', req.talent);
		})
	;
});

app.post('/talent/:id', verifyMongoID('id'), function(req, res, next) {
	Talent.findByIdAndUpdate(req.id, req.body, function(err, doc) {
		if (err) return next(err);
		res.redirect('/');
	});
});


/******************
 *  Start Server  *
 ******************/

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});
