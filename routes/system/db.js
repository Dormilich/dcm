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
  , tables  = {
	  talent:   require( path.join(appRoot, 'models/talent') ),
	  zauber:   require( path.join(appRoot, 'models/zauber') ),
	  ritual:   require( path.join(appRoot, 'models/ritual') ),
	  liturgie: require( path.join(appRoot, 'models/liturgie') )
  };

module.exports = function (app) {
	// check table existence
	app.param('table', function(req, res, next, id) {
		if (tables[id] instanceof Object) {
			req.tableName = id;
			next();
		}
		else {
			next(new Error("Keine solche Tabelle in der Datenbank."));
		}
	});
	// get DB contents
	app.get('/dump/:table.json', function (req, res, next) {
		var tableName = req.tableName;
		tables[tableName]
			.find()
			.select("-__v -_id")
			.lean()
			.exec(function(err, objs) {
				if (err) return next(err);
				res.set('Content-Type: application/octet-stream');
				res.set('Content-Disposition', 'attachment; filename"'+tableName+'.json"');
				res.json(objs);
			})
		;
	});
	// insert DB data
	app.get('/insert', function (req, res, next) {
		res.render('system/db-upload');
	});
	app.post('/insert/:table', function (req, res, next) {
		tables[req.tableName].create(req.body, function(err) {
			if (err) return next(err);
			res.end(arguments.length-1 + " Datensätze gespeichert.");
		});
	});
};
