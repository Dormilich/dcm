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
	// Account Panel
	app.get('/profil', function(req, res, next) {
		res.render('users/profil', { _User: req.user });
	});
	// Character list	
	app.get('/helden', function(req, res, next) {
		async.parallel({
			_Own: function (cb) {
				Held
					.find({ disabled: false })
					.in("_id", req.user.chars)
					.select('Person AP')
					.sort('AP.alle')
					.exec(function(err, arr) {
						if (err) return cb(err);
						cb(null, arr);
					})
				;
			},
			_Group: function (cb) {
				User
					.find()
					.in("_id", req.user.friends)
					.populate({ 
						path:   "chars",
						match:  { disabled: false },
						select: "Person AP",
						options: {
							sort: "AP.alle"
						}
					})
					.exec(function(err, arr) {
						if (err) return cb(err);
						cb(null, arr);
					})
				;
			}
		},
		function (err, obj) {
			if (err) return next(err); 
			obj._User = req.user;
			obj._Menu = menu.profil;
			obj._Menu.currentURL = req.path;
			res.render('users/chars', obj);
		});
	});
	// deleted Characters' list	
	app.get('/papierkorb', function(req, res, next) {
		Held
			.find({ disabled: true })
			.in("_id", req.user.chars)
			.sort('AP.alle')
			.exec(function(err, arr) {
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
	app.get('/freunde', function(req, res, next) {
		/*User
			.find()
			.in("_id", req.user.friends)
			.exec(function(err, docs) {
				if (err) return next(err);
				var nav = menu.profil;
				nav.currentURL = req.path;
				res.render('users/friends', { 
					_User:    req.user,
					_Friends: docs,
					_Menu:    nav
				});
			})
		;//*/
		async.parallel({
			_Friends: function (cb) {
				User
					.find()
					.in("_id", req.user.friends)
					.exec(function(err, docs) {
						if (err) return cb(err);
						cb(null, docs);
					})
				;
			},
			_Notices: function (cb) {
				Message.find({  
					recipient: req.user.id,
					topic:     "friendship request",
					read:      false,
					deleted:   false
				}, function(err, arr) {
					if (err) return cb(err);
					cb(null, docs);
				});
			}
		}, 
		function(err, obj) {
			if (err) return next(err);
			obj._User = req.user;
			obj._Menu = menu.profil;
			obj._Menu.currentURL = req.path;
			res.render('users/friends', obj);
		});
	});
	// save friend list via AJAX
	app.post('/freunde', function(req, res, next) {
		req.user.friends = req.body.friends;
		req.user.save(function(err) {
			if (err) return next(err);
			res.json({ count: req.user.friends.length });
		});
	});
	// get list of users matching a name string
	app.get('/userlist', function(req, res, next) {
		var query = null;
		if ("name" in req.query) {
			query = User
				.find({ "local.name": new RegExp(req.query.name, "i") })
				.nin("_id", [req.user._id].concat(req.user.friends));
		}
		else if ("id" in req.query) {
			query = User.findById(req.query.id);
		}
		else {
			res.json(404);
			return null;
		}
		query.exec(function(err, arr) {
			if (err) return next(err);
			res.json(arr.map(function(user) {
				return {
					id:    user._id,
					name:  user.local.name,
					email: user.local.email
				};
			}));
		});
	});
	app.post('/friendship', function(req, res, next) {
		if (!("id" in req.query)) {
			res.status(400);
			return null;
		}
		Message.create({
			sender:    req.user._id,
			recipient: req.query.id,
			topic:     "friendship request"
		}, function(err, doc) {
			if (err) {
				res.status(500);
			}
			else {
				res.status(204);
			}
		});
	});
	// ### TODO ###
	// About page
	app.get('/about', function(req, res, next) {
		res.render('about', { _User: req.user });
	});
};
