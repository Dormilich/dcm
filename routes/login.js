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

var path      = require('path')
  , appRoot   = path.dirname(require.main.filename)
  , reCaptcha = require("librecaptcha")
  , rcConfig  = require( path.join(appRoot, 'config/auth') ).reCaptcha
  ;

module.exports = function (app, passport) {
	// splash screen, login links
	app.get('/', function (req, res, next) {
		res.render('splash');
	});
	app.get('/logout', function (req, res, next) {
		req.logout();
		res.redirect('/');
	});
	
	// LOCAL LOGIN (email/password)
	
	app.get('/login', function (req, res, next) {
		res.render('login', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : "/helden",
		failureRedirect : "/login",
		failureFlash    : true
	}));
	
	app.get('/signup', function (req, res, next) {
		// load and serve reCaptcha form
		var localConfig = rcConfig[req.host];
		if (!localConfig) {
			return next(new Error("Fehler beim Laden des Captchas."));
		}
		var captcha = new reCaptcha(localConfig);
		res.render('signup', {  
			message:   req.flash('signupMessage'),
			recaptcha: captcha.generate()
		});
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : "/helden",
		failureRedirect : "/signup",
		failureFlash    : true
	}));
	
	// GOOGLE
	
	app.get('/auth/google', passport.authenticate('google', { 
		scope: ["profile", "email"] 
	}));
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: '/helden',
		failureRedirect: '/'
	}));
	
	// Facebook

	// OpenID
	
	// AUTHORIZE
	
	/* local */
	
	app.get('/connect/local', function(req, res) {
		// same a for signup since both use the same Strategy
		var localConfig = rcConfig[req.host];
		if (!localConfig) {
			return next(new Error("Fehler beim Laden des Captchas."));
		}
		var captcha = new reCaptcha(localConfig);
		res.render('connect-local', {  
			message:   req.flash('signupMessage'),
			recaptcha: captcha.generate()
		});
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profil',
		failureRedirect: '/connect/local',
		failureFlash:    true
	}));
	
	/* Google+ */
	
	app.get('/connect/google', passport.authorize('google', {  
		scope: ["profile", "email"]
	}));
	
	app.get('/connect/google/callback', passport.authorize('google', {
		successRedirect: '/profil',
		failureRedirect: '/'
	}));
	
	// UNLINK

	/* local */
	
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.name     = undefined;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profil');
		});
	});

	/* Google+ */
	
	app.get('/unlink/google', function(req, res) {
		var user            = req.user;
		user.google.token   = undefined;
		user.save(function(err) {
			res.redirect('/profil');
		});
	});
};
