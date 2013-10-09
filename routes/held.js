var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , Held    = require( path.join(appRoot, 'models/person') )
  , data    = require( path.join(appRoot, 'data/dsa') )
  ;
module.exports = {
	// show a list of all available Characters
	list: function(req, res, next) {
		Held
			.find({ disabled: !!req.query.deleted })
			.select('Person AP')
			.lean()
			.exec(function(err, arr) {
				if (err) return next(err);
				res.render('list-helden', { Liste: arr });
			})
		;
	},
	// show the Character's data (aka Character Sheet)
	show: function (req, res, next) {
		Held
			.findById(req.id)
			.exec(function(err, doc) {
				if (err) return next(err);
				if (!doc) return next();
				res.render('held', doc);
			})
		;
	},
	// remove Character from list
	disable: function (req, res, next) {
		Held.findByIdAndUpdate(req.id, { disabled: true }, function (err, doc) {
			if (err) return next(err);
			res.redirect('/helden');
		});
	},
	// show the edit list of a Character's data's section
	// useful with sections that do not need to import data
	edit: function(req, res, next) {
		Held
			.findById(req.id)
			.lean()
			.exec(function(err, obj) {
				if (err) next(err);
				obj._data = data[req.section];
				res.render('edit-held/' + req.section, obj);
			})
		;
	},
	// save changes
	save: function (req, res, next) {
		req.body.modified = new Date();
		Held.findByIdAndUpdate(req.id, req.body, function(err, doc) {
			if (err) return next(err);
			res.redirect('/held/' + req.id);
		});
	}
};