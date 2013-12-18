var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Held    = require( path.join(appRoot, 'models/person') )
  , data    = require( path.join(appRoot, 'data/dsa') )
  ;
module.exports = {
	show: function(req, res, next) {
		Held
			.findById(req.id)
			.populate('Magie.Zauber._zauber')
			.exec(function(err, doc) {
				if (err)  return next(err);
				if (!doc) return next();
				res.render('magie', doc);
			})
		;
	}
};