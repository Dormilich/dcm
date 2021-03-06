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
  , Ritual  = require( path.join(appRoot, 'models/ritual') )
  , data    = require( path.join(appRoot, '/data/dsa') )
  ;

module.exports = function (app) {
	// list rituals
	app.get('/ritual/liste', function (req, res, next) {
		Ritual
			.find()
			.sort('Name')
			.lean()
			.exec(function(err, objs) {
				if (err) return next(err);
				res.render('system/table-of-rituals', { Rituale: objs });
			})
		;
	});
	// new ritual form
	app.get('/ritual/neu', function(req, res, next) {
		var obj = {
			_merkmal: data.magie.Merkmal,
			_rkListe: data.ritual.Ritualkenntnis,
			_rkTypen: data.magie.Ritualkenntnis
		};
		res.render('system/new-ritual', obj);
	});
	// save new ritual
	app.post('/ritual/neu', function(req, res, next) {
		Ritual.create(req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/ritual/liste');
		});
	});
	// ritual edit form
	app.get('/ritual/:rid', function(req, res, next) {
		Ritual.findById(req.params.rid, function(err, doc) {
			if (err)  return next(err);
			if (!doc) return next('route');
			var obj = {
				_merkmal: data.magie.Merkmal,
				_rkListe: data.ritual.Ritualkenntnis,
				_rkTypen: data.magie.Ritualkenntnis,
				_ritual : doc
			};
			res.render('system/edit-ritual', obj);
		});
	});
	// save edited ritual
	app.put('/ritual/:rid', function(req, res, next) {
		Ritual.findByIdAndUpdate(req.params.rid, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/ritual/liste');
		});
	});
	// delete ritual
	app.delete('/ritual/:rid', function(req, res, next) {
		Ritual.findByIdAndRemove(req.params.rid, function(err, doc) {
			if (err) return next(err);
			res.redirect('/ritual/liste');
		});
	});
};
