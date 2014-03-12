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
  , User    = require( path.join(appRoot, 'models/user') )
  ;

module.exports = function (app) {
	// Account Panel
	app.get('/profil', function(req, res, next) {
		res.render('users/profil', { _User: req.user });
	});
	// Character list	
	app.get('/helden', function(req, res, next) {
		res.render('users/chars', { _User: req.user });
	});
/*
	app.get('/helden', function(req, res, next) {
		var disabled = ("deleted" in req.query);
		Held
			.find({ disabled: disabled })
			.select('Person AP')
			.sort('AP.alle')
			.lean()
			.exec(function(err, arr) {
				if (err) return next(err);
				var obj = {
					_liste: arr,
					_disabled: disabled,
					_formData: {
						method: disabled ? "put" : "delete",
						sign:   disabled ? "\u2713" : "\u2717",
						title:  disabled ? "wiederherstellen" : "löschen",
						class:  disabled ? "restore" : "remove"
					}
				};
				res.render('list-helden', obj);
			})
		;
	});
*/
	// Friend list
	app.get('/freunde', function(req, res, next) {
		User
			.find()
			.in("_id", req.user.friends)
			.exec(function(err, docs) {
				if (err) return next(err);
				res.render('users/friends', { 
					_User:    req.user,
					_Friends: docs
				});
			})
		;
	});
	app.get('/userlist', function(req, res, next) {
		var query = null;
		if ("name" in req.query) {
			query = User.find({ "local.name": new RegExp("^"+req.query.name, "i") });
		}
		else if ("id" in req.query) {
			query = User.findById(req.query.id);
		}
		else {
			res.json(404);
			return null;
		}
		query
			.select("local.name _id friends chars")
			.lean()
			.exec(function(err, arr) {
				if (err) return next(err);
				res.json(arr);
			})
		;
	});
	// About page
	app.get('/about', function(req, res, next) {
		res.render('about', { _User: req.user });
	});
};
