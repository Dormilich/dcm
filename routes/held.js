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
  , Held    = require( path.join(appRoot, 'models/person') )
  , data    = require( path.join(appRoot, 'data/dsa') )
  , menu    = require( path.join(appRoot, 'data/menu') )
  ;

module.exports = function (app) {
	// display character sheet (mundane)
	app.get('/held/:mdbread', function (req, res, next) {
		Held.findById(req.id, function(err, doc) {
			if (err)  return next(err);
			if (!doc) return next();
			// auto-populate all Talents
			var talentTypes = Object.keys(doc.Talente)
				.filter(function(item) {
					return (typeof doc.Talente[item] !== 'function');
				})
				.map(function(item) {
					return { path: "Talente."+item+"._talent" };
				})
			;
			Held.populate(doc, talentTypes, function(err, doc) {
				if (err) return next(err);
				var nav        = menu.helden;
				nav.currentURL = req.path;
				res.render('held/held', {
					_Held: doc,
					_Menu: nav
				});
			});
		});
	});
	// display character sheet (magic)
	app.get('/magie/:mdbread', function(req, res, next) {
		Held
			.findById(req.id)
			.populate('Magie.Zauber._zauber Magie.Ritualkenntnis._talent Magie.Rituale')
			.exec(function(err, doc) {
				if (err)  return next(err);
				if (!doc) return next();
				/* Node does not seem to support locale aware string comparison
				doc.Magie.Zauber.sort(function(a, b) {
					return a._zauber.Name.localeCompare(b._zauber.Name, "de");
				});//*/
				var nav        = menu.magie;
				nav.currentURL = req.path;
				res.render('held/magie', {
					_Held: doc,
					_Menu: nav
				});
			})
		;
	});
	// display character sheet (ordained)
	app.get('/weihe/:mdbread', function(req, res, next) {
		Held
			.findById(req.id)
			.populate('Weihe.Liturgiekenntnis._talent Weihe.Liturgien')
			.exec(function(err, doc) {
				if (err)  return next(err);
				if (!doc) return next();
				var nav        = menu.weihe;
				nav.currentURL = req.path;
				res.render('held/geweiht', {
					_Held: doc,
					_Menu: nav
				});
			})
		;
	});
	/**********************************
	 ***  delete/restore Character  ***
	 **********************************/
	// delete character
	app.delete('/held/:mdbwrite', function (req, res, next) {
		Held.findByIdAndUpdate(req.id, { disabled: true }, function (err, doc) {
			if (err) return next(err);
			res.redirect('/helden');
		});
	});
	// restore character
	app.put('/held/:mdbwrite', function (req, res, next) {
		Held.findByIdAndUpdate(req.id, { disabled: false }, function (err, doc) {
			if (err) return next(err);
			res.redirect('/helden');
		});
	});
	/**********************************
	 ***    AJAX requested data     ***
	 **********************************/
	// re-evaluate Kampfwerte after application of the Spell "Attributo"
	app.get('/attributo/:mongoid', function (req, res, next) {
		Held.findById(req.id, function (err, doc) {
			if (err) {
				return res.json(500, { error: err });
			}
			try {
				var attr = req.query.attribut.toUpperCase();
				var wert = Math.abs(req.query.wert);
				// check for validaty
				if (!(attr in doc.Attribute)) {
					throw new Error("Ungültiges Attribut.");
				}
				if (isNaN(wert)) {
					throw new Error("Üngültiger Attributwert.");
				}
				// adjust attribute value
				doc.Attribute[attr].wert = wert;
				// get new derived values
				var _ini = Math.round( (doc.Attribute.MU.wert * 2 + doc.Attribute.IN.wert + doc.Attribute.GE.wert) / 5 )
				res.json({
					iniBasis : _ini,
					iniMod   : doc.modifikatoren.INI,
					AT : doc.Kampfwerte.AT,
					PA : doc.Kampfwerte.PA,
					FK : doc.Kampfwerte.FK,
					WS : doc.Kampfwerte.WS
				});
			}
			catch (e) {
				res.json(400, { error: e });
			}
		});
	});
};
