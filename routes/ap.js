var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Held    = require( path.join(appRoot, 'models/chardata') )
  ;
module.exports = {
	show: function (req, res, next) {
		req.held.populate('held', function(err, doc) {
			if (err) return next(err);
			res.render('edit-ap', doc);
		});
	},
	save: function (req, res, next) {
		req.body.modified = Date.now();
		Held.findByIdAndUpdate(req.id, req.body, function(error, doc) {
			if (error) return next(error);
			res.redirect('/held/' + req.id);
		});
	}
};
