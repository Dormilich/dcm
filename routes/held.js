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
  ;
module.exports = {
	// show a list of all available Characters
	list: function(req, res, next) {
		Held
			.find({ disabled: !!req.query.deleted })
			.select('Person AP')
			.sort('AP.alle')
			.lean()
			.exec(function(err, arr) {
				if (err) return next(err);
				res.render('list-helden', { Liste: arr });
			})
		;
	},
	// show the Character's data (aka Character Sheet)
	show: function (req, res, next) {
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
				res.render('held', doc);
			});
		});
	},
	// remove Character from list
	disable: function (req, res, next) {
		Held.findByIdAndUpdate(req.id, { disabled: true }, function (err, doc) {
			if (err) return next(err);
			res.redirect('/helden');
		});
	},
	// show the edit list of a Character's data's section
	// useful with sections that do not need to import data
	edit: function(req, res, next) {
		Held
			.findById(req.id)
			.lean()
			.exec(function(err, obj) {
				if (err) next(err);
				obj._data = data[req.section];
				res.render('edit-held/' + req.section, obj);
			})
		;
	},
	// save changes
	save: function (req, res, next) {
		req.body.modified = new Date();
		Held.findByIdAndUpdate(req.id, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/held/' + req.id);
		});
	}
};