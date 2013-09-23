var Person = require('../models/person');

module.exports = {
	list: function(req, res, next) {
		Person
			.find({ disabled: !!req.query.deleted })
			.select('Person')
			.lean()
			.exec(function(error, results) {
				if (error) {
					return next(error);
				}
				res.render('table-of-characters', { Liste: results });
			})
		;
	},
	show: function (req, res, next) { // using :mongoid
		res.render('charakter-db', req.person);
	},
	remove: function (req, res, next) { // using :id
		Person.findByIdAndUpdate(req.id, { disabled: true }, function (error, doc) {
			if (error) {
				return next(error);
			}
			res.redirect('/chars');
		});
	}
};