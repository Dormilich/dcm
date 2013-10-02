var path    = require('path')
  , async   = require('async')
  , appRoot = path.dirname(require.main.filename)
  , data    = require( path.join(appRoot, 'data/dsa') )
  , Held    = require( path.join(appRoot, 'models/chardata') )
  , Talent  = require( path.join(appRoot, 'models/talent') )
  ;
function merge(target, source) {
	Object.keys(source).forEach(function(key) {
		if (!(key in target)) {
			target[key] = source[key];
		}
	});
	if (arguments.length > 2) {
		var argv = Array.prototype.splice.call(arguments, 1, 1);
		return merge.apply(this, argv);
	}
	return target;
}

module.exports = {
	talente : function(req, res, next) {
		async.parallel({
			körperlich: function(cb) {
				Talent
					.find({ typ: "Körperliche Talente" })
					.sort('name')
					.lean()
					.exec(function(err, objs) {
						if (err) { 
							cb(err);
						}
						else {
							cb(null, objs);
						}
					})
				;
			},
			Gesellschaft: function(cb) {
				Talent
					.find({ typ: "Gesellschaftliche Talente" })
					.sort('name')
					.lean()
					.exec(function(err, objs) {
						if (err) { 
							cb(err);
						}
						else {
							cb(null, objs);
						}
					})
				;
			},
			Natur: function(cb) {
				Talent
					.find({ typ: "Naturtalente" })
					.sort('name')
					.lean()
					.exec(function(err, objs) {
						if (err) { 
							cb(err);
						}
						else {
							cb(null, objs);
						}
					})
				;
			},
			Wissen: function(cb) {
				Talent
					.find({ typ: "Wissenstalente" })
					.sort('name')
					.lean()
					.exec(function(err, objs) {
						if (err) { 
							cb(err);
						}
						else {
							cb(null, objs);
						}
					})
				;
			},
			Handwerk: function(cb) {
				Talent
					.find({ typ: "Handwerkstalente" })
					.sort('name')
					.lean()
					.exec(function(err, objs) {
						if (err) { 
							cb(err);
						}
						else {
							cb(null, objs);
						}
					})
				;
			},
			_chardata: function(cb) {
				Held
					.findById(req.id)
					.populate('held')
					.exec(function(err, doc) {
						if (err) {
							cb(err);
						}
						else {
							cb(null, doc);
						}
					})
				;
			}
		},
		function(err, obj) {
			if (err) return next(err);
			merge(obj, data.talente);
			res.render('list-talente', obj);
		});
	}
};