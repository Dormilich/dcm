var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Held    = require( path.join(appRoot, 'models/chardata') )
  , data    = require( path.join(appRoot, 'data/dsa') )
  ;
module.exports = {
	list: function(req, res, next) {
		Held
			.find({ disabled: !!req.query.deleted })
			.populate('held')
			.select('held AP')
			.lean()
			.exec(function(err, arr) {
				if (err) return next(err);
				res.render('list-helden', { Liste: arr });
			})
		;
	},
	show: function (req, res, next) {
		Held
			.findById(req.id)
			.populate('held')
			.exec(function(err, doc) {
				if (err) return next(err);
				doc._charID = doc.populated('held');
				res.render('held', doc);
			})
		;
	},
	disable: function (req, res, next) {
		Held.findByIdAndUpdate(req.id, { disabled: true }, function (err, doc) {
			if (err) return next(err);
			res.redirect('/helden');
		});
	},
	edit: function(req, res, next) {
		Held
			.findById(req.id)
			.populate('held')
			.lean()
			.exec(function(err, obj) {
				if (err) next(err);
				obj._data = data[req.section];
				res.render('edit-' + req.section, obj);
			})
		;
	},
	save: function (req, res, next) {
		req.body.modified = new Date();
		Held.findByIdAndUpdate(req.id, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/held/' + req.id);
		});
	}
};