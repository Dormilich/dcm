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
