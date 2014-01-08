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
  , appRoot  = path.dirname(require.main.filename)
  , Liturgie = require( path.join(appRoot, 'models/liturgie') )
  , data     = require( path.join(appRoot, '/data/dsa') )
  ;

module.exports = {
	list: function (req, res, next) {
		Liturgie
			.find()
			.sort('name grad')
			.lean()
			.exec(function(err, objs) {
				if (err) return next(err);
				res.render('system/table-of-miracles', { "$Liste": objs });
			})
		;
	},
	create: function(req, res, next) {
		res.render('system/new-liturgie', { "$Liste": data.sf.Götter });
	},
	save: function(req, res, next) {
		Liturgie.create(req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/liturgie/liste');
		});
	},
	edit: function(req, res, next) {
		Liturgie.findById(req.params.lid, function(err, doc) {
			if (err)  return next(err);
			if (!doc) return next('route');
			doc._Götter = data.sf.Götter
			res.render('system/edit-liturgie', doc);
		});
	},
	update: function(req, res, next) {
		Liturgie.findByIdAndUpdate(req.params.lid, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/liturgie/liste');
		});
	},
	remove: function(req, res, next) {
		Liturgie.findByIdAndRemove(req.params.lid, function(err, doc) {
			if (err) return next(err);
			res.redirect('/liturgie/liste');
		});
	}
};
