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
  , Talent  = require( path.join(appRoot, 'models/talent') )
  ;

module.exports = function (app) {
	// list skills
	app.get('/talent/liste', function (req, res, next) {
		Talent
			.find()
			.sort('typ name')
			.lean()
			.exec(function(err, docs) {
				if (err) return next(err);
				res.render('system/table-of-talents', { Liste: docs });
			})
		;
	});
	// new skill form
	app.get('/talent/neu', function(req, res, next) {
		Talent
			.find()
			.lean()
			.distinct('typ', function(err, arr) {
				if (err) return next(err);
				res.render('system/new-talent', { kategorie: arr });
			})
		;
	});
	// save new skill
	app.post('/talent/neu', function(req, res, next) {
		Talent.create(req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/talent/liste');
		});
	});
	// skill edit form
	app.get('/talent/:tid', function(req, res, next) {
		Talent
			.findById(req.params.tid)
			.exec(function(err, doc) {
				Talent
					.find()
					.lean()
					.distinct('typ', function(err, docs) {
						if (err) return next(err);
						doc.kategorie = docs;
						res.render('system/edit-talent', doc);
					})
				;
			})
		;
	});
	// save edited skill
	app.put('/talent/:tid', function(req, res, next) {
		Talent.findByIdAndUpdate(req.params.tid, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/talent/liste');
		});
	});
	// delete skill
	app.delete('/talent/:tid', function(req, res, next) {
		Talent.findByIdAndRemove(req.params.tid, function(err, doc) {
			if (err) return next(err);
			res.redirect('/talent/liste');
		});
	});
};
