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

/**************************************
 ***       Load Dependencies        ***
 **************************************/

var express  = require('express')
  , app      = express()
  , path     = require('path')
  , http     = require('http')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash    = require('connect-flash')
  , menu     = require('./data/menu')
  ;

/**************************************
 *** Configure Express Application  ***
 **************************************/

app.set('port', process.env.PORT || 80);  // ENV values from the Windows ENV
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/Favicon_Chromatrix.png'));
app.use(express.logger('dev'));
app.use(express.compress());              // gzip/deflate
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());        // use PUT/DELETE
app.use(express.cookieParser());
app.use(express.session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'))); // serve static files
app.use(app.router);                      // calls routes before static
/* Handle 404
	 this is middleware, not an error handler. 
	 if all previous routes/files failed, this is the response being sent.
 */
app.use(function(req, res, next) {
	res.status(404);
	next(new Error('Die Seite "' + req.originalUrl + '" existiert leider nicht.'));
});
// Handle errors
app.use(function(error, req, res, next) {
	var status = res.statusCode < 400 ? 500 : res.statusCode;
	//console.log(error.stack)
	res.status(status).render('error-message', {
		title  : 'Error ' + status + ': ' + http.STATUS_CODES[status], 
		message: error.message || error,
		_Menu  : menu,
		_User  : req.user
	});
});
app.locals.pretty = true;

/**************************************
 ***       Configure Passport       ***
 **************************************/

require('./config/passport-dcm')(passport);

/**************************************
 ***  Connect to and Watch MongoDB  ***
 **************************************/

mongoose.connect(process.env.MONGODB_URL); 
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

/**************************************
 ***       Define HTTP Routes       ***
 **************************************/

// load app params
require('./config/param')(app);

// set DB admin (once)
app.get('/db/init', function (req, res, next) {
	var User = require('./models/user');
	User.remove({ isAdmin: true }, function(err, admin) {
		if (err) return next(err);
		var admin            = new User();
		// create DB Admin
		admin.isAdmin        = true;
		admin.local.email    = process.env.MONGODB_ADMIN_EMAIL;
		admin.local.name     = process.env.MONGODB_ADMIN_NAME;
		admin.local.password = admin.generateHash(process.env.MONGODB_ADMIN_PASSWORD);
		admin.save(function(err, doc) {
			if (err) return next(err);
			res.redirect('/login');
		});
	});
});
app.get(/^([\w-.])$/, function(req, res, next) {
	
});

// setup login paths
require('./routes/login')(app, passport);

// protect following paths
app.all(/.+/, function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		res.redirect('/login');
	}
});

// User Control Panel
require("./routes/user")(app);

// create and save a character
// display character sheet (mundane, magic ordained)
// delete/restore character
require("./routes/held")(app);

// edit/save character sheet sections
// edit CharSheet Talent section (needs to load data from system table)
require("./routes/edit")(app);

/* Manage DB */

// only Admin can access this part
app.all(/.+/, function isAdmin(req, res, next) {
	if (req.user.isAdmin) {
		next();
	}
	else {
		res.status(403);
		next(new Error("Zugriff verweigert."));
	}
});
// DB navigation
app.get('/db', function (req, res, next) {
	res.render('system/nav');
});
// Talente
require('./routes/system/talent')(app);
// Zauber + Varianten
require('./routes/system/zauber')(app);
// Rituale
require('./routes/system/ritual')(app);
// Liturgien
require("./routes/system/liturgie")(app);
// get/insert DB contents
require("./routes/system/db")(app);

/**************************************
 ***          Start Server          ***
 **************************************/

app.listen(app.get('port'), function(){
	console.log("Express %s server listening on port %d", app.get('env'), app.get('port'));
});
