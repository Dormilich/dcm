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

app.set('port', process.env.PORT || 8080);  // ENV values from the Windows ENV
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());              // gzip/deflate
//app.use(express.bodyParser());            // parse POST data into req.body
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());        // use PUT/DELETE
app.use(app.router);                      // calls routes before static
app.use(express.static(path.join(__dirname, 'public'))); // serve static files
// Handle 404
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
		console.log('Mongoose connection terminated');
		process.exit(0);
	});
});

/************************
 *  Define HTTP Routes  *
 ************************/

var routes = {
	talent:   require('./routes/system/talent'),
	zauber:   require('./routes/system/zauber'),
	ritual:   require('./routes/system/ritual'),
	liturgie: require('./routes/system/liturgie')
};

app.get('/', function(req, res, next) {
	res.render('system/nav');
});

// Talente
app.get('/talent/liste',   routes.talent.list);
app.get('/talent/neu',     routes.talent.create);
app.post('/talent/neu',    routes.talent.save);
app.get('/talent/:tid',    routes.talent.edit);
app.put('/talent/:tid',    routes.talent.update);
app.delete('/talent/:tid', routes.talent.remove);

// Zauber
app.get('/zauber/liste',   routes.zauber.list);
app.get('/zauber/neu',     routes.zauber.create);
app.post('/zauber/neu',    routes.zauber.save);
app.get('/zauber/:zid',    routes.zauber.edit);
app.put('/zauber/:zid',    routes.zauber.update);
app.delete('/zauber/:zid', routes.zauber.remove);

// Zauber-Varianten
app.get('/variante/neu',  routes.zauber.variante.create);
app.post('/variante/neu', routes.zauber.variante.save);
app.get('/zauber/:zid/variante/:vid',    routes.zauber.variante.edit);
app.put('/zauber/:zid/variante/:vid',    routes.zauber.variante.update);
app.delete('/zauber/:zid/variante/:vid', routes.zauber.variante.remove);

// Rituale
app.get('/ritual/liste',   routes.ritual.list);
app.get('/ritual/neu',     routes.ritual.create);
app.post('/ritual/neu',    routes.ritual.save);
app.get('/ritual/:rid',    routes.ritual.edit);
app.put('/ritual/:rid',    routes.ritual.update);
app.delete('/ritual/:rid', routes.ritual.remove);

// Liturgien
app.get('/liturgie/liste',   routes.liturgie.list);
app.get('/liturgie/neu',     routes.liturgie.create);
app.post('/liturgie/neu',    routes.liturgie.save);
app.get('/liturgie/:lid',    routes.liturgie.edit);
app.put('/liturgie/:lid',    routes.liturgie.update);
app.delete('/liturgie/:lid', routes.liturgie.remove);

/******************
 *  Start Server  *
 ******************/

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});
