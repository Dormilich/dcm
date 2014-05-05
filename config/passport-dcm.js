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

var path             = require('path')
  , appRoot          = path.dirname(require.main.filename)
  , User             = require( path.join(appRoot, 'models/user') )
  , configAuth       = require( path.join(appRoot, 'config/auth') ) 
  , LocalStrategy    = require("passport-local").Strategy
  , GoogleStrategy   = require("passport-google-oauth").OAuth2Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , reCaptcha        = require("librecaptcha")
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
		"local-login",
		new LocalStrategy({
			usernameField     : "email",
			passwordField     : "password",
			passReqToCallback : true			
		}, function(req, email, password, done) {
			process.nextTick(function() {
				var re = new RegExp("^"+email+"$", "i");
				User.findOne({ "local.email": re }, function(err, user) {
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

	/**************************************
	 ***   Signup with Email/Password   ***
	 **************************************/

	passport.use(
		"local-signup",
		new LocalStrategy({
			usernameField     : "email",
			passwordField     : "password",
			passReqToCallback : true
		}, function(req, email, password, done) {
			process.nextTick(function() {
				// verify reCaptcha
				var captcha = new reCaptcha(configAuth.reCaptcha);
				captcha.verify({
					remoteip : req.ip,
					challenge: req.body.recaptcha_challenge_field,
					response : req.body.recaptcha_response_field
				}, function(err) {
					if (err) {
						return done(null, false, req.flash("signupMessage", "Captcha-Verifizierung fehlgeschlagen."));
					}
					// assign User to DB
					if (!req.user) {
						var re = new RegExp("^"+email+"$", "i");
						User
							.findOne()
							.or([
								{ "local.email"   : re }, 
								{ "google.email"  : re }, 
								{ "facebook.email": re }, 
								{ "openid.email"  : re }
							])
							.exec(function(err, user) {
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
							})
						;
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
			});
		})
	);
	
	/**************************************
	 ***       Login with Google        ***
	 **************************************/

	passport.use(new GoogleStrategy({
		clientID          : configAuth.googleAuth.clientID,
		clientSecret      : configAuth.googleAuth.clientSecret,
		callbackURL       : configAuth.googleAuth.callbackURL,
		passReqToCallback : true 
	},
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			if (!req.user) {
				User.findOne({ 'google.id' : profile.id }, function(err, user) {
					if (err) {
						return done(err);
					}
					if (user) {
						if (!user.google.token) {
							user.google.token = token;
							user.google.name  = profile.displayName;
							user.google.email = profile.emails[0].value; 

							user.save(function(err) {
								if (err) {
									throw err;
								}
								return done(null, user);
							});
						}
						return done(null, user);
					} 
					else {
						var newUser          = new User();

						newUser.google.id    = profile.id;
						newUser.google.token = token;
						newUser.google.name  = profile.displayName;
						newUser.google.email = profile.emails[0].value; 

						newUser.save(function(err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			} 
			else {
				var user          = req.user;

				user.google.id    = profile.id;
				user.google.token = token;
				user.google.name  = profile.displayName;
				user.google.email = profile.emails[0].value;

				user.save(function(err) {
					if (err) {
						throw err;
					}
					return done(null, user);
				});
			}
		});
	}));
	
	/**************************************
	 ***      Login with Facebook       ***
	 **************************************/

	passport.use(new FacebookStrategy({
		clientID          : configAuth.facebookAuth.clientID,
		clientSecret      : configAuth.facebookAuth.clientSecret,
		callbackURL       : configAuth.facebookAuth.callbackURL,
		passReqToCallback : true 
	},
	function(req, token, refreshToken, profile, done) {
		process.nextTick(function() {
			// check if the user is already logged in
			if (!req.user) {
				User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
					if (err) {
						return done(err);
					}
					if (user) {
						// if there is a user id already but no token
						// (user was linked at one point and then removed)
						if (!user.facebook.token) {
							user.facebook.token = token;
							user.facebook.name	= profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.email = profile.emails[0].value;

							user.save(function(err) {
								if (err) {
									throw err;
								}	
								return done(null, user);
							});
						}
						// user found, return that user
						return done(null, user); 
					} 
					else {
						// if there is no user, create one
						var newUser            = new User();

						newUser.facebook.id    = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;

						newUser.save(function(err) {
							if (err) {
								throw err;
							}	
							return done(null, newUser);
						});
					}
				});

			} else {
				// user already exists and is logged in, we have to link accounts
				var user            = req.user;

				user.facebook.id    = profile.id;
				user.facebook.token = token;
				user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
				user.facebook.email = profile.emails[0].value;

				user.save(function(err) {
					if (err) {
						throw err;
					}	
					return done(null, user);
				});
			}
		});
	}));

	// OpenID
};
