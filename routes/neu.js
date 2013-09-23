var path   = require('path')
  , Person = require('../models/person')
  ;
module.exports = {
	index: function (req, res, next) {
		if (req.query.force === "jade") {
			res.render('new_char');
		}
		else {
			var appRoot = path.dirname(require.main.filename);
			res.sendfile('neu.html', { root: path.join(appRoot, 'public') });
		}
	},
	save: function(req, res, next) {
		var key
		  , mod = req.body.modifikatoren
		  ;
		// array => value
		for (key in mod) {
			if (Array.isArray(mod[key])) {
				mod[key] = mod[key].reduce(function (prev, curr) {
					return (+prev) + (+curr);
				}, 0);
			}
		}
		// save
		new Person(req.body)
			.save(function(error, doc, affectedRows) {
				if (error) {
					return next(error);
				}
				res.redirect('/char/' + doc._id);
			})
		;
	}
}
