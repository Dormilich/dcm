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
  , async   = require('async')
  , Held    = require( realpath('models/person') )
  , User    = require( realpath('models/user') )
  , Message = require( realpath('models/message') )
  , menu    = require( realpath('data/menu') )
  ;

function realpath(relativePath) {
	return path.join(appRoot, relativePath);
}

module.exports = function (app) {
	// ### TODO ###
	// About page
	app.get('/about', function (req, res, next) {
		Message
			.find({  
				recipient: req.user.id,
				topic:     "friendship request",
				read:      false, // accepted state
				deleted:   false  // rejected state
			})
			.count(function (err, cnt) {
				if (err) return cb(err);
				var nav        = menu.profil;
				nav.currentURL = req.path;
				res.render('about', {  
					_User:    req.user,
					_Menu:    nav,
					_FRCount: cnt
				});
			})
		;
	});
	// Account Panel
	app.get('/profil', function (req, res, next) {
		Message
			.find({  
				recipient: req.user.id,
				topic:     "friendship request",
				read:      false, // accepted state
				deleted:   false  // rejected state
			})
			.count(function (err, cnt) {
				if (err) return cb(err);
				var nav        = menu.profil;
				nav.currentURL = req.path;
				res.render('users/profil', {  
					_User:    req.user,
					_Menu:    nav,
					_FRCount: cnt
				});
			})
		;
	});
	// Character list	
	app.get('/helden', function (req, res, next) {
		async.parallel({
			_Own: function (cb) {
				Held
					.find({ disabled: false })
					.in("_id", req.user.chars)
					.select('Person AP')
					.sort('AP.alle')
					.exec(function (err, arr) {
						if (err) return cb(err);
						cb(null, arr);
					})
				;
			},
			_Group: function (cb) {
				User
					.find({ "friends": req.user._id })
					.populate({ 
						path:   "chars",
						match:  { disabled: false },
						select: "Person AP",
						options: {
							sort: "AP.alle"
						}
					})
					.exec(function (err, arr) {
						if (err) return cb(err);
						cb(null, arr);
					})
				;
			},
			_FRCount: function (cb) {
				Message
					.find({  
						recipient: req.user.id,
						topic:     "friendship request",
						read:      false, // accepted state
						deleted:   false  // rejected state
					})
					.count(function (err, cnt) {
						if (err) return cb(err);
						cb(null, cnt);
					})
				;
			}
		},
		function (err, obj) {
			if (err) return next(err); 
			obj._User            = req.user;
			obj._Menu            = menu.profil;
			obj._Menu.currentURL = req.path;
			res.render('users/chars', obj);
		});
	});
	// deleted Characters list	
	app.get('/papierkorb', function (req, res, next) {
		Held
			.find({ disabled: true })
			.in("_id", req.user.chars)
			.sort('AP.alle')
			.exec(function (err, arr) {
				if (err) return next(err);
				var nav = menu.profil;
				nav.currentURL = req.path;
				res.render('users/deleted', {  
					_User:  req.user,
					_Menu:  nav,
					_Chars: arr
				});
			})
		;
	});
	// Friend list
	app.get('/freunde', function (req, res, next) {
		async.parallel({
			_Friends: function (cb) {
				User
					.find()
					.in("_id", req.user.friends)
					.exec(function (err, docs) {
						if (err) return cb(err);
						cb(null, docs);
					})
				;
			},
			_Group: function (cb) {
				User.find({ "friends": req.user._id }, function (err, docs) {
					if (err) return cb(err);
					cb(null, docs);
				});
			},
			_Inbox: function (cb) {
				Message
					.find({  
						recipient: req.user.id,
						topic:     "friendship request",
						read:      false, // accepted state
						deleted:   false  // rejected state
					})
					.populate("sender") 
					.exec(function (err, arr) {
						if (err) return cb(err);
						cb(null, arr);
					})
				;
			},
			_Outbox: function (cb) {
				Message
					.find({  
						sender:  req.user.id,
						topic:   "friendship request",
						read:    false, // accepted state
						deleted: false  // rejected state
					})
					.populate("recipient") 
					.exec(function (err, arr) {
						if (err) return cb(err);
						cb(null, arr);
					})
				;
			}
		}, 
		function(err, obj) {
			if (err) return next(err);
			obj._User            = req.user;
			obj._Menu            = menu.profil;
			obj._Menu.currentURL = req.path;
			obj._FRCount         = obj._Inbox.length;
			res.render('users/friends', obj);
		});
	});
	// save friend list (AJAX)
	app.post('/freunde', function (req, res, next) {
		req.user.friends = req.body.friends;
		req.user.save(function (err) {
			if (err) return next(err);
			res.json({ 
				count: req.user.friends.length 
			});
		});
	});
	// get list of users matching a name string (AJAX)
	app.get('/userlist', function (req, res, next) {
		var query = null;
		var re    = ".";
		// find user by name
		if ("name" in req.query) {
			re    = new RegExp(req.query.name, "i");
			query = User
				.find({ isAdmin: false })
				.or([
					{ "facebook.name": re }, 
					{ "google.name"  : re }, 
					{ "local.name"   : re },
					{ "openid.name"  : re }
				])
			;
		}
		// find user by ID
		else if ("id" in req.query) {
			query = User.findById(req.query.id);
		}
		else {
			res.json(404);
			return null;
		}
		// exclude own friends
		if (req.query.skip === "own") {
			query.nin("_id", [req.user._id].concat(req.user.friends));
		}
		// excluding friend group
		else if (req.query.skip === "group") {
			query.ne("friends", req.user._id)
		}
		// execute
		query.exec(function (err, arr) {
			if (err) return next(err);
			res.json(arr.map(function (user) {
				var username = user.getName();
				return {
					id:    user._id,
					name:  username,
					email: user.getEmail(username)
				};
			}));
		});
	});
	// write a friendship request message (AJAX)
	app.get('/friendship', function (req, res, next) {
		// check User ID
		if (!("id" in req.query)) {
			res.status(400).end();
			return null;
		}
		User
			.findById(req.query.id)
			.exec()
			.then(function (user) {
				// check if recipient exists
				if (!user) {
					throw new Error("Nutzer unbekannt.");
				}
				// check if you’re already a friend
				if (user.friends.indexOf(req.user._id) > -1) {
					throw new Error("Freundschaft existiert bereits.")
				}
				// check if there is a pending friendship request
				return Message
					.find({
						sender:    req.user._id,
						recipient: req.query.id,
						topic:     "friendship request",
						read:      false,
						deleted:   false
					})
					.count()
					.exec()
				;
			})
			.then(function (count) {
				if (count > 0) {
					throw new Error("Freundschaftsanfrage läuft bereits.")
				}
				// check if the last rejected friendship request 
				// is younger than 1 month (FR spam protect)
				var datetime = new Date();
				datetime.setMonth(datetime.getMonth() - 1);
				return Message
					.find({
						sender:    req.user._id,
						recipient: req.query.id,
						topic:     "friendship request"
					})
					.where("created")
					.gt(datetime)
					.count()
					.exec()
				;
			})
			.then(function (count) {
				if (count > 0) {
					throw new Error("Die letzte Freundschaftsanfrage ist jünger als 1 Monat.")
				}
				// finally create the message
				return Message.create({
					sender:    req.user._id,
					recipient: req.query.id,
					topic:     "friendship request"
				});
			})
			.then(function (msg) {
				res.status(204).end();
			})
			.then(null, function (err) {
				res.status(500).end(err.message);
			})
		;
	});
	// accept/deny friendship (AJAX)
	app.get('/friendship/:status', function (req, res, next) {
		// check User ID
		if (!("message" in req.query)) {
			res.status(400).end();
			return null;
		}
		var query;
		if (req.params.status === "accept") {
			query = Message.findByIdAndUpdate(req.query.message, { read: true });
		}
		else if (req.params.status === "reject") {
			query = Message.findByIdAndUpdate(req.query.message, { deleted: true });
		}
		query.exec(function(err, msg) {
			if (err) {
				res.status(500).end(err.message);
			}
			else {
				res.status(204).end();
			}
		});
	});
	// modify local account data
	app.get('/change/local', function (req, res, next) {
		var nav        = menu.profil;
		nav.currentURL = req.path;
		res.render('users/local-data', {  
			_User:    req.user,
			_Menu:    nav,
			_Message: req.flash('passwordMessage')
		});
	});
	app.put('/change/local', function (req, res, next) {
		var user = req.user;
		// change user name
		if (typeof req.body.display_name === 'string') {
			user.local.name = req.body.display_name;
			user.save(function (err) {
				if (err) return next(err);
				res.redirect('/profil');
			});
		}
		// change user password
		else if (Array.isArray(req.body.password) && req.body.password.length === 2) {
			var password = req.body.password[0];
			var data 	 = {  
				_User:    user,
				_Menu:    menu.profil,
				_Message: ""
			};
			data._Menu.currentURL = req.path;
			if (password !== req.body.password[1]) {
				data._Message = "Passwörter stimmen nicht überein";
				res.render('users/local-data', data);
			}
			else if (password.length < 8) {
				data._Message = "Passwort zu kurz";
				res.render('users/local-data', data);
			}
			else {
				user.local.password = user.generateHash(password);
				user.save(function (err) {
					if (err) return next(err);
					res.redirect('/profil');
				});
			}
		}
	});
};
