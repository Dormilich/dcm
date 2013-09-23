var Person = require('../models/person');

module.exports = {
	show: function (req, res, next) { // using :mongoid
		res.render('edit_char', req.person);
	},
	save: function (req, res, next) { // using :id
		req.body.modified = Date.now();
		Person.findByIdAndUpdate(req.id, req.body, function(error, doc) {
			if (error) {
				return next(error);
			}
			res.render('charakter-db', doc);
		});
	}
};
