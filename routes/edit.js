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

var path     = require('path')
  , fs       = require('fs')
  , async    = require('async')
  , appRoot  = path.dirname(require.main.filename)
  , data     = require( realpath('data/dsa') )
  , Held     = require( realpath('models/person') )
  , Talent   = require( realpath('models/talent') )
  , Zauber   = require( realpath('models/zauber') )
  , Ritual   = require( realpath('models/ritual') )
  , Liturgie = require( realpath('models/liturgie') )
  ;

function getTalentType(tname) {
	return function (cb) {
		Talent
			.find({ typ: tname })
			.sort('name')
			.lean()
			.exec(function (err, objs) {
				if (err) return cb(err);
				cb(null, objs);
			})
		;
	};
}

module.exports = function (app) {
	// Character's skills edit form
	app.get('/talente/:mdbwrite', function(req, res, next) {
		async.parallel({
			_Nahkampf:     getTalentType("Nahkampf"),
			_Fernkampf:    getTalentType("Fernkampf"),
			_körperlich:   getTalentType("Körperliche Talente"),
			_Gesellschaft: getTalentType("Gesellschaftliche Talente"),
			_Natur:        getTalentType("Naturtalente"),
			_Wissen:       getTalentType("Wissenstalente"),
			_Handwerk:     getTalentType("Handwerkstalente"),
			_Sprachen:     getTalentType("Sprachen"),
			_Schriften:    getTalentType("Schriften"),
			_Gaben:        getTalentType("Gaben"),
			_held: function (cb) {// _chardata
				Held.findById(req.id, function(err, doc) {
					if (err) return cb(err);
					cb(null, doc);
				});
			}
		},
		function (err, obj) {
			if (err) return next(err); 
			res.render('edit-held/talente', obj);
		});
	});
	// Character's spells edit form
	app.get('/zauber/:mdbwrite', function(req, res, next) {
		async.parallel({
			_zauber: function (cb) {
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
			_held: function (cb) {
				Held
					.findById(req.id)
					.select('Person Magie')
					.populate('Magie.Zauber._zauber')
					.exec(function(err, doc) {
						if (err) return cb(err);
						cb(null, doc);
					})
				;
			}
		},
		function(err, obj) {
			if (err) return next(err);
			res.render('edit-held/zauber', obj);
		});
	});
	// Character's rituals edit form
	app.get('/rituale/:mdbwrite', function(req, res, next) {
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
					.populate("Magie.Ritualkenntnis._talent Magie.Rituale")
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
					.exec(function(err, doc) {
						if (err) return cb(err);
						var rk = doc.Magie.Ritualkenntnis || [];
						var rk = rk.map(function (item) {
							return item.short;
						});
						if (doc.Vorteile.indexOf("Zweistimmiger Gesang") > -1) {
							rk.push("Elf");
						}
						Ritual
							.find()
							.in("Repräsentationen", rk)
							.sort("Name")
							.exec(function(err, doc) {
								if (err) return cb(err);
								cb(null, doc);
							})
						;
					})
				;
			}
		},
		function (err, obj) {
			if (err) return next(err);
			obj._data = data.ritual;
			res.render('edit-held/rituale', obj);
		});
	});
	// Character's liturgies edit form
	app.get('/liturgien/:mdbwrite', function(req, res, next) {
		async.parallel({
			_held: function (cb) {
				Held
					.findById(req.id)
					.populate('Weihe.Liturgiekenntnis._talent Weihe.Liturgien')
					.select("Person Weihe")
					.exec(function(err, doc) {
						if (err) return cb(err);
						cb(null, doc);
					})
				;
			},
			_gottheiten: function (cb) {
				Talent
					.find({ typ: "Liturgiekenntnis" })
					.sort('name')
					.exec(function(err, docs) {
						if (err) return cb(err);
						cb(null, docs);
					})
				;
			},
			_liturgien: function (cb) {
				Held
					.findById(req.id)
					.populate('Weihe.Liturgiekenntnis._talent')
					.select('Weihe')
					.exec()
					.then(function(held) {
						var götter = held.Weihe.Liturgiekenntnis.map(function(item) {
							return item._talent.name;
						});
						return Liturgie
							.find()
							.in('typ', götter)
							.sort('name grad')
							.exec()
						;
					})
					.then(function (docs) {
						cb(null, docs);
					})
					.then(null, function (err) {
						cb(err);
					})
				;
			}
		},
		function (err, obj) {
			if (err) return next(err);
			res.render('edit-held/liturgien', obj);
		})
	});
	// Character's weapons
	app.get('/waffen/:mdbwrite', function(req, res, next) {
		async.parallel({
			_Nahkampf:     getTalentType("Nahkampf"),
			_Fernkampf:    getTalentType("Fernkampf"),
			_held: function (cb) {// _chardata
				Held.findById(req.id, function(err, doc) {
					if (err) return cb(err);
					cb(null, doc);
				});
			}
		},
		function (err, obj) {
			if (err) return next(err); 
		//	obj._data = data.waffen;
			res.render('edit-held/waffen', obj);
		});
	});
	app.delete('/waffen/:typ/:mdbwrite', function(req, res, next) {
		Held.findById(req.id, function(err, doc) {
			if (err) return next(err);
			if (doc && doc.Ausrüstung[req.params.typ]) {
				doc.Ausrüstung[req.params.typ] = undefined;
				doc.save(function(err, doc) {
					if (err) return next(err);
					res.redirect('/held/' + req.id);
				});
			}
			else {
				res.redirect('/waffen/' + req.id);
			}
		});
	});
	// edit other character sheet sections
	app.get('/:section/:mdbwrite', function(req, res, next) {
		Held
			.findById(req.id)
			.exec(function(err, obj) {
				if (err) next(err);
				obj._data = data[req.section];
				res.render('edit-held/' + req.section, obj);
			})
		;
	});
	// save changes
	app.put('/:section/:mdbwrite',  function (req, res, next) {
		req.body.modified = new Date();
		Held.findByIdAndUpdate(req.id, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/held/' + req.id);
		});
	});
};
