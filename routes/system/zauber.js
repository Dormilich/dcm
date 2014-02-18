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
  , Zauber  = require( path.join(appRoot, 'models/zauber') )
  , data    = require( path.join(appRoot, '/data/dsa') )
  ;

module.exports = function (app) {
	// ==========================================
	// === Spells ===============================
	// ==========================================
	// list of spells
	app.get('/zauber/liste', function(req, res, next) {
		Zauber
			.find()
			.sort('Name')
			.lean()
			.exec(function(err, docs) {
				if (err) return next(err);
				res.render('system/table-of-spells', { Zauber: docs });
			})
		;
	});
	// new spell form
	app.get('/zauber/neu', function(req, res, next) {
		res.render('system/new-zauber', data.magie);
	});
	// save new spell
	app.post('/zauber/neu', function(req, res, next) {
		Zauber.create(req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/zauber/liste');
		});
	});
	// spell edit form
	app.get('/zauber/:zid', function(req, res, next) {
		Zauber.findById(req.params.zid, function(err, doc) {
			if (err)  return next(err);
			if (!doc) return next('route');
			data.magie._Zauber = doc;
			res.render('system/edit-zauber', data.magie);
		});
	});
	// save edited spell
	app.put('/zauber/:zid', function(req, res, next) {
		Zauber.findByIdAndUpdate(req.params.zid, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/zauber/liste');
		});
	});
	// delete spell
	app.delete('/zauber/:zid', function(req, res, next) {
		Zauber.findByIdAndRemove(req.params.zid, function(err, doc) {
			if (err) return next(err);
			res.redirect('/zauber/liste');
		});
	});
	// ==========================================
	// === Spell variants =======================
	// ==========================================
	// add variant to spell form
	app.get('/variante/neu', function(req, res, next) {
		Zauber
			.find()
			.sort('Name')
			.select('Name _id')
			.lean()
			.exec(function(err, objs) {
				if (err) return next(err);
				data.magie.Zauber = objs;
				res.render('system/new-variant', data.magie);
			})
		;
	});
	// save variant
	app.post('/variante/neu', function(req, res, next) {
		Zauber.findById(req.body.zauber, function(err, doc) {
			if (err) return next(err);
			doc.Varianten.push(req.body);
			doc.save(function(err, doc) {
				if (err) return next(err);
				res.redirect('/zauber/liste');
			});
		});
	});
	// variant of spell edit form
	app.get('/zauber/:zid/variante/:vid', function(req, res, next) {
		Zauber.findById(
			req.params.zid, 
			{ 
				"Varianten": { $elemMatch: { "_id": req.params.vid } },
				_id:  true,
				Name: true
			}, 
			function(err, doc) {
				if (err) return next(err);
				data.magie._Zauber = {
					Name: doc.Name,
					_id : doc._id
				};
				if (Array.isArray(doc.Varianten) && doc.Varianten.length > 0) {
					data.magie._Variante = doc.Varianten[0];
					res.render('system/edit-variant', data.magie);
				}
				else {
					next(new Error("Keine solche Variante vorhanden."));
				}
			}
		);
	});
	// save edited variant
	app.put('/zauber/:zid/variante/:vid', function(req, res, next) {
		Zauber.update(
			{ "_id": req.params.zid, "Varianten._id": req.params.vid },
			{ $set: { "Varianten.$": req.body } },
			function(err, numAffected) {
				if (err) return next(err);
				console.log("%d Variante geändert", numAffected);
				res.redirect('/zauber/liste');
			}
		);
	});
	// delete variant
	app.delete('/zauber/:zid/variante/:vid', function(req, res, next) {
		Zauber.findById(req.param.zid, function(err, doc) {
			if (err) return next(err);
			doc.Varianten.pull(req.params.vid);
			doc.save(function(err, doc, num) {
				console.log("%d Variante gelöscht.", num);
				res.redirect('/zauber/liste');
			});
		});
	});
};

/* keep it as info how to [remove a nested element] with a $pull operator
Zauber.findByIdAndUpdate(
	req.params.zid,
	{ $pull: { Varianten: { "_id": req.params.vid } } },
	function(err, doc) {
		if (err) return next(err);
		res.redirect('/zauber/liste');
	}
);//*/
