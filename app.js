
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

app.set('port', process.env.PORT || 80);  // ENV values from the Windows ENV
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/Favicon_Chromatrix.png'));
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
mongoose.connection.on('connected', function _connected() {
	console.log('Mongoose connected to DB ' + this.host + ':' + this.port+ '/' + this.name);
});
mongoose.connection.on('disconnected', function _disconnected() {
	console.log('Mongoose connection closed');
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

var routes = {}
  , Person = require('./models/person')
  , Held   = require('./models/chardata')
  ;
// set up routes
["neu", "char", "edit"].forEach(function(file) {
	routes[file] = require('./routes/'+file);
});
function execCB(success) {
	return function(error, doc) {
		if (error) {
			next(error);
		}
		else if (doc) {
			success(doc);
			next();
		}
		else {
			res.statusCode = 404;
			next(new Error("Kein Datensatz gefunden."));
		}
	}
}
function mongoID(identifyer) {
	return function (req, res, next) {
		if (!/^[0-9a-fA-F]+$/.test(req.params[identifyer])) {
			return next(new Error("Keine gültige MongoDB ID."));
		}
		req.id = req.params[identifyer];
		next();
	}
}
// pre-route request modification
app.param('person', function (req, res, next, id) {
	if (!/^[0-9a-fA-F]+$/.test(id)) {
		return next(new Error("Keine gültige MongoDB ID."));
	}
	Person
		.findById(id)
		.exec(execCB(function(doc) {
			req.person = doc;
		}))
	;
});
app.param('held', function (req, res, next, id) {
	if (!/^[0-9a-fA-F]+$/.test(id)) {
		return next(new Error("Keine gültige MongoDB ID."));
	}
	Held
		.findOne({ held: id })
		.exec(execCB(function(doc) {
			req.held = doc;
		}))
	;

});
app.param('mongoid', function (req, res, next, id) {
	if (!/^[0-9a-fA-F]+$/.test(id)) {
		return next('route');
	}
	req.id = id;
	next();
});


// demo
app.get('/', function (req, res) {
	res.redirect('/chars');
});

// create and save a character
app.get( '/neu', routes.neu.index);
app.post('/neu', routes.neu.save);
// display character(s)
app.get('/chars', routes.char.list);
app.get('/char/:person', routes.char.show);
// unset character
app.delete('/char/:mongoid', routes.char.remove);
// edit character
app.get('/edit/:person', routes.edit.show);
app.put('/edit/:mongoid', routes.edit.save);
// add AP to char
app.get('/ap/:mongoid', function(req, res, next) {
	Person
		.findById(req.id)
		.select('Person.Name')
		.lean()
		.exec(function(err, doc) {
			if (err) next(err);
			
		})
	;
});
// dixplay extended character
app.get('/held/:mongoid', function(req, res, next) {
	Held
		.findOne({ held: req.id })
		.populate('held')
		.exec(function(err, doc) {
			if (err) return next(err);
			res.render('held', doc);
		})
	;
});

/******************
 *  Start Server  *
 ******************/

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});
