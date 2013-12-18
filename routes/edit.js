var path    = require('path')
  , async   = require('async')
  , appRoot = path.dirname(require.main.filename)
  , data    = require( path.join(appRoot, 'data/dsa') )
  , Held    = require( path.join(appRoot, 'models/person') )
  , Talent  = require( path.join(appRoot, 'models/talent') )
  , Zauber  = require( path.join(appRoot, 'models/zauber') )
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

function getTalentType(tname) {
	return function(cb) {
		Talent
			.find({ typ: tname })
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
	};
}

module.exports = {
	talente : function(req, res, next) {
		async.parallel({
			Nahkampf:     getTalentType("Nahkampf"),
			Fernkampf:    getTalentType("Fernkampf"),
			körperlich:   getTalentType("Körperliche Talente"),
			Gesellschaft: getTalentType("Gesellschaftliche Talente"),
			Natur:        getTalentType("Naturtalente"),
			Wissen:       getTalentType("Wissenstalente"),
			Handwerk:     getTalentType("Handwerkstalente"),
			Sprachen:     getTalentType("Sprachen"),
			Schriften:    getTalentType("Schriften"),
			Gaben:        getTalentType("Gaben"),
			_chardata: function(cb) {
				Held.findById(req.id, function(err, doc) {
					if (err) {
						cb(err);
					}
					else if (!doc) {
						cb(new Error("Kein Datensatz gefunden."));
					}
					else {
						cb(null, doc);
					}
				});
			}
		},
		function(err, obj) {
			if (err) return next(err);
			res.render('edit-held/taw', obj);
		});
	},
	zauber : function(req, res, next) {
		async.parallel({
			Zauber: function(cb) {
				Zauber
					.find()
					.sort('Name')
					.lean()
					.exec(function(err, objs) {
						if (err) return cb(err);
						cb(null, objs);
					})
				;
			},
			Held: function(cb) {
				Held
					.findById(req.id)
					.select('Person Magie')
					.populate('Magie.Zauber._zauber')
					.exec(function(err, doc) {
						if (err) {
							cb(err);
						}
						else if (!doc) {
							cb(new Error("Kein Datensatz gefunden."));
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
			res.render('edit-held/zauber', obj);
		});
	}
};