var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Held    = require( path.join(appRoot, 'models/chardata') )
  ;
module.exports = {
	list: function(req, res, next) {
		Held
			.find({ disabled: !!req.query.deleted })
			.populate('held')
			.select('held AP')
			.lean()
			.exec(function(error, results) {
				if (error) return next(error);
				res.render('list-helden', { Liste: results });
			})
		;
	},
	show: function (req, res, next) {
		req.held.populate('held', function(err, doc) {
			if (err) return next(err);
			doc._charID = doc.populated('held');
			res.render('held', doc);
		});
	},
	disable: function (req, res, next) {
		Held.findByIdAndUpdate(req.id, { disabled: true }, function (error, doc) {
			if (error) return next(error);
			res.redirect('/helden');
		});
	}
};