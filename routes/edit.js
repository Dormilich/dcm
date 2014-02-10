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
  , async   = require('async')
  , appRoot = path.dirname(require.main.filename)
  , data    = require( path.join(appRoot, 'data/dsa') )
  , Held     = require( path.join(appRoot, 'models/person') )
  , Talent   = require( path.join(appRoot, 'models/talent') )
  , Zauber   = require( path.join(appRoot, 'models/zauber') )
  , Ritual   = require( path.join(appRoot, 'models/ritual') )
  , Liturgie = require( path.join(appRoot, 'models/liturgie') )
  ;

function merge(target, source) {
	Object.keys(source).forEach(function(key) {
		if (!(key in target)) {
			target[key] = source[key];
		}
	});
	if (arguments.length > 2) {
		var argv = Array.prototype.splice.call(arguments, 1, 1);
		return merge.apply(this, argv);
	}
	return target;
}

function getTalentType(tname) {
	return function(cb) {
		Talent
			.find({ typ: tname })
			.sort('name')
			.lean()
			.exec(function(err, objs) {
				if (err) { 
					cb(err);
				}
				else {
					cb(null, objs);
				}
			})
		;
	};
}

module.exports = {
	talente : function(req, res, next) {
		async.parallel({
			Nahkampf:     getTalentType("Nahkampf"),
			Fernkampf:    getTalentType("Fernkampf"),
			körperlich:   getTalentType("Körperliche Talente"),
			Gesellschaft: getTalentType("Gesellschaftliche Talente"),
			Natur:        getTalentType("Naturtalente"),
			Wissen:       getTalentType("Wissenstalente"),
			Handwerk:     getTalentType("Handwerkstalente"),
			Sprachen:     getTalentType("Sprachen"),
			Schriften:    getTalentType("Schriften"),
			Gaben:        getTalentType("Gaben"),
			_chardata: function(cb) {
				Held.findById(req.id, function(err, doc) {
					if (err) {
						cb(err);
					}
					else if (!doc) {
						cb(new Error("Kein Datensatz gefunden."));
					}
					else {
						cb(null, doc);
					}
				});
			}
		},
		function(err, obj) {
			if (err) return next(err);
			res.render('edit-held/taw', obj);
		});
	},
	zauber : function(req, res, next) {
		async.parallel({
			Zauber: function(cb) {
				Zauber
					.find()
					.sort('Name')
					.lean()
					.exec(function(err, objs) {
						if (err) return cb(err);
						cb(null, objs);
					})
				;
			},
			Held: function(cb) {
				Held
					.findById(req.id)
					.select('Person Magie')
					.populate('Magie.Zauber._zauber')
					.exec(function(err, doc) {
						if (err) {
							cb(err);
						}
						else if (!doc) {
							cb(new Error("Kein Datensatz gefunden."));
						}
						else {
							cb(null, doc);
						}
					})
				;
			}
		},
		function(err, obj) {
			if (err) return next(err);
			res.render('edit-held/zauber', obj);
		});
	},
	liturgien : function(req, res, next) {
		// I could un-nest one level at most, but get it m.o.l. back through async
		Talent
			.find({ typ: "Liturgiekenntnis" })
			.sort('name')
			.exec(function(err, lks) {
				if (err)  return next(err);
				Held
					.findById(req.id)
					.populate('Weihe.Liturgiekenntnis._talent Weihe.Liturgien')
					.select('Person Weihe')
					.exec(function(err, obj) {
						if (err)  return next(err);
						obj._gottheiten = lks;
						obj._götter = obj.Weihe.Liturgiekenntnis.map(function(item) {
							return item._talent.name;
						});
						Liturgie
							.find()
							.in('typ', obj._götter)
							.sort('name grad')
							.exec(function(err, docs) {
								if (err) return next(err);
								obj._liturgien = docs;
								res.render('edit-held/liturgie', obj);
							})
						;
					})
				;	
			})
		;
	},
	rituale : function(req, res, next) {
		async.parallel({
			_talente: function (cb) {
				Talent
					.find({ typ: "Schamanismus" })
					.exec(function(err, docs) {
						if (err) return cb(err);
						cb(null, docs);
					})
				;
			},
			_held: function (cb) {
				Held
					.findById(req.id)
					.populate("Magie.Ritualkenntnis._talent")
					.select("Person Magie")
					.exec(function(err, doc) {
						if (err) return cb(err);
						cb(null, doc);
					})
				;
			},
			_rituale: function (cb) {
				Held
					.findById(req.id)
					.select("Magie")
					.exec(function(err, doc) {
						if (err) return cb(err);
						var rk = doc.Magie.Ritualkenntnis.map(function (item) {
							return item.short;
						});
						Ritual
							.find()
							.in("Repräsentationen", rk)
							.sort("Name")
							.exec(function(err, doc) {
								if (err) return cb(err);
								cb(null, doc);
							})
					})
				;
			}
		},
		function(err, obj) {
			if (err) return next(err);
			obj._data = data.ritual;
			res.render('edit-held/ritual', obj);
		});
		/*Talent
			.find({ typ: "Schamanismus" })
			.exec(function(err, objs) {
				if (err)  return next(err);
				Held
					.findById(req.id)
					.populate("Magie.Ritualkenntnis._talent")
					.exec(function(err, obj) {
						if (err)  return next(err);
						obj._data    = data.ritual;
						obj._talente = objs;
						res.render('edit-held/ritual', obj);
					})
				;
			})
		;//*/
	}
};