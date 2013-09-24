var path   = require('path')
  , Person = require('../models/person')
  , Heldendaten = require('../models/chardata')
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
		Person.create(req.body, function(error, person) {
				if (error) return next(error);
				
				Heldendaten.create({ 
					held: person._id,
					AP: {
						frei: 0,
						alle: ((+person.Attribute.KL.wert) + (+person.Attribute.IN.wert)) * 20
					}
				}, function(error, doc) {
					if (error) return next(error);
					res.redirect('/char/' + doc.held);
				});
			})
		;
	}
};
