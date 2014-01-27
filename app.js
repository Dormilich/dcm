/* 
 * The MIT License
 *
 * Copyright 2014 Bertold von Dormilich <Dormilich@netscape.net>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
//app.use(express.bodyParser());            // parse POST data into req.body
app.use(express.urlencoded());
app.use(express.json());
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
	//console.log(error.stack)
	res.status(status).render('error-message', {
		title: 'Error ' + status + ': ' + http.STATUS_CODES[status], 
		message: error.message || error
	});
});
app.locals.pretty = true;

/**********************************
 *  Connect to and Watch MongoDB  *
 **********************************/

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

/************************
 *  Define HTTP Routes  *
 ************************/

var routes = {};
// set up routes
["neu", "held", "edit", "magie", "weihe"].forEach(function(file) {
	routes[file] = require('./routes/'+file);
});

function mapMatch() {
	var args = arguments;
	return function(req, res, next) {
		for (var i=0, l=args.length; i < l; i++) {
			req[args[i]] = req.params[i];
		}
		next();
	};
}
// pre-route request modification
app.param('mongoid', function (req, res, next, id) {
	if (!/^[0-9a-fA-F]+$/.test(id)) {
		return next('route');
	}
	req.id = id;
	next();
});

// demo
app.get('/', function (req, res) {
	res.redirect('/helden');
});
// list all characters
app.get('/helden', routes.held.list);

// create and save a character
app.get( '/neu', routes.neu.index);
app.post('/neu', routes.neu.create);

// display character sheet
app.get('/held/:mongoid', routes.held.show);
// display character sheet (magic)
app.get('/magie/:mongoid', routes.magie.show);
// display character sheet (ordained)
app.get('/weihe/:mongoid', routes.weihe.show);

// delete character
app.delete('/held/:mongoid', routes.held.disable);

// edit character sheet sections
app.get(/^\/(ap|sf|char|ritual)\/([0-9a-fA-F]+)$/, mapMatch('section', 'id'), routes.held.edit);
// edit CharSheet Talent section (needs to load data from system table)
app.get('/talente/:mongoid', routes.edit.talente);
app.get('/zauber/:mongoid',  routes.edit.zauber);
app.get('/liturgien/:mongoid', routes.edit.liturgien);
// save changes
// Liturgie preprocessing of Talent's Liturgiekenntnis section
app.put('/talente/:mongoid', routes.weihe.unset);
app.put(/^\/(ap|sf|char|talente|zauber|liturgien)\/([0-9a-fA-F]+)$/, 
	mapMatch('section', 'id'), routes.held.save);

/******************
 *  Start Server  *
 ******************/

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});
