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
  ;
module.exports = {
	index: function (req, res, next) {
		if (req.query.force === "jade") {
			res.render('new-char');
		}
		else {
			res.sendfile('neu.html', { root: path.join(appRoot, 'public') });
		}
	},
	create: function(req, res, next) {
		var key
		  , mod = req.body.modifikatoren
		  ;
		// array => value
		/* faster by factor 2-3 against Object.keys().filter().forEach() */
		for (key in mod) {
			if (Array.isArray(mod[key])) {
				mod[key] = mod[key].reduce(function (prev, curr) {
					return (+prev) + (+curr);
				}, 0);
			}
		}
		req.body.AP = {
			frei: 0,
			alle: ((+req.body.Attribute.KL.wert) + (+req.body.Attribute.IN.wert)) * 20
		};
		Held.create(req.body, function(error, doc) {
			if (error) return next(error);
			res.redirect('/held/' + doc._id);
		});
	}
};
