
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

mongoose.connect('localhost', 'dc1'); 
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

var Person = require('./models/person')
  , routes = {}
  ;
// set up routes
["neu", "char", "edit"].forEach(function(file) {
	routes[file] = require('./routes/'+file);
});
// pre-route request modification
app.param('mongo', function (req, res, next, id) {
	if (!/^[0-9a-fA-F]+$/.test(id)) {
		return next(new Error("Keine gültige MongoDB ID."));
	}
	Person
		.findById(id)
		.exec(function(error, person) {
			if (error) {
				next(error);
			}
			else if (person) {
				req.person = person;
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

// demo
app.get('/', function (req, res) {
	res.redirect('/chars');
});

// create and save a character
app.get( '/neu', routes.neu.index);
app.post('/neu', routes.neu.save);
// display character(s)
app.get('/chars', routes.char.list);
app.get('/char/:mongo', routes.char.show);
// unset character
app.delete('/char/:id', verifyMongoID('id'), routes.char.remove);
// edit character
app.get('/edit/:mongo', routes.edit.show);
app.put('/edit/:id', verifyMongoID('id'), routes.edit.save);

/******************
 *  Start Server  *
 ******************/

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});


/********************
 *  comment section *
 ********************/
/*
// the app
app.put('/users/:id', function (req, res, next) {
  // edit your user here
});
// client side must be..
<form> ...
  <input type="hidden" name="_method" value="put" />
</form>
===
Route /:name    --> req.params.name
GET ?name=value --> req.query.name
POST name=value --> req.body.name
===
// my-template.jade
extends my-layout
  
block head
  script(src="myfile.js")

block content
  h1 My page
===
// my-layout.jade
doctype 5
html
  head
    title My title
    block head
  body
    #content
      block content
//*/