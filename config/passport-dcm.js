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

var path           = require('path')
  , appRoot        = path.dirname(require.main.filename)
  , User           = require( path.join(appRoot, 'models/user') )
  , LocalStrategy  = require("passport-local").Strategy
  //, GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
  //, configAuth     = require( path.join(appRoot, 'config/auth') ) 
  ;

module.exports = function (passport) {

	/**************************************
	 ***     Passport session setup     ***
	 **************************************/

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	/**************************************
	 ***   Login with Email/Password    ***
	 **************************************/

	passport.use(
		"local-signup",
		new LocalStrategy({
			usernameField     : "email",
			passwordField     : "password",
			passReqToCallback : true
		}, function(req, email, password, done) {
			process.nextTick(function() {
				if (!req.user) {
					User.findOne({ "local.email": email }, function(err, user) {
						if (err) {
							return done(err);
						}
						if (user) {
							return done(null, false, req.flash("signupMessage", "Diese E-Mail existiert bereits"));
						}
						else {
							var newUser            = new User();
							newUser.local.email    = email;
							newUser.local.password = newUser.generateHash(password);
							newUser.local.name     = req.body.display_name;

							newUser.save(function(err) {
								if (err) throw err;
								return done(null, newUser);
							});
						}
					});
				}
				else {
					var user            = req.user;
					user.local.email    = email;
					user.local.password = user.generateHash(password);
					user.local.name     = req.body.display_name;
					
					user.save(function(err) {
						if (err) throw err;
						return done(null, user);
					});
				}
			});
		})
	);

	/**************************************
	 ***   Signup with Email/Password   ***
	 **************************************/

	passport.use(
		"local-login",
		new LocalStrategy({
			usernameField     : "email",
			passwordField     : "password",
			passReqToCallback : true			
		}, function(req, email, password, done) {
			process.nestTick(function() {
				User.findOne({ "local.email": email }, function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, req.flash("loginMessage", "Benutzer unbekannt."));
					}
					if (!user.validPassword(password)) {
						return done(null, false, req.flash("loginMessage", "Falsches Passwort."));
					}
					return done(null, user);
				});
			});
		})
	);
	
	// GOOGLE LOGIN
	
	// Facebook

	// OpenID
};