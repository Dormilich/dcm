var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Person  = require( path.join(appRoot, 'models/person') )
  , Held    = require( path.join(appRoot, 'models/chardata') )
  ;
module.exports = {
	show: function (req, res, next) {
		res.render('edit_char', req.person);
	},
	save: function (req, res, next) {
		req.body.modified = new Date();
		Person
			.findByIdAndUpdate(req.id, req.body)
			.select('_id')
			.exec()
			.then(function(doc) {
				return Held
					.findOne({ held: doc._id })
					.select('_id')
					.exec()
				;
			}, function(error) {
				next(error);
			})
			.then(function(ID) {
				res.redirect('/held/' + ID._id);
			}, function(error) {
				next(error);
			})
		;
	}
};