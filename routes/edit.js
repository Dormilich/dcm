var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Held    = require( path.join(appRoot, 'models/chardata') )
  ;
module.exports = {
	ap: function(req, res, next) {
		req.held.populate('held', function(err, doc) {
			if (err) next(err);
			res.render('edit-ap');
		});
	},
	sf: function(req, res, next) {
		req.held.populate('held', function(err, doc) {
			if (err) next(err);
			
			res.render('edit-sf');
		});
	}
};