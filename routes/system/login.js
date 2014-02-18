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

var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  ;

function isLoggedIn(req, res, next) 
{
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
module.exports = function (app, passport) {
	// splash screen, login links
	app.get('/', function (req, res, next) {
		res.render('system/splash');
	});
	app.get('/login', function (req, res, next) {
		res.render('system/login', { message: req.flash('loginMessage') });
	});
	app.get('/signup', function (req, res, next) {
		res.render('system/signup', { message: req.flash('signupMessage') });
	});
	app.get('/navigation', isLoggedIn, function (req, res, next) {
		res.render('system/nav', { user: req.user });
	});
	app.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	});
};
