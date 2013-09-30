var path    = require('path')
  , async   = require('async')
  , appRoot = path.dirname(require.main.filename)
  , data    = require( path.join(appRoot, 'data/dsa') )
  , Held    = require( path.join(appRoot, 'models/chardata') )
  , Talent  = require( path.join(appRoot, 'models/talent') )
  ;
module.exports = {
	talente : function(req, res, next) {
		Talent
			.distinct('typ')
			.lean()
			.exec(function(err, arr) {
				if (err) return next(err);
				
			})
		;
		
		Talent
			.find()
			.sort('typ name')
			.lean()
			.exec(function(err, docs) {
				if (err) return next(err);
				//res.render('table-of-talents', { Liste: docs });
			})
		;
	}
};