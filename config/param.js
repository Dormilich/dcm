var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , fs      = require('fs')
  , User    = require( realpath('models/user') )
  ;

function realpath(relativePath) {
	return path.join(appRoot, relativePath);
}

module.exports = function (app) {

	var editDirFileNames = fs.readdirSync( realpath('views/edit-held') ).map(function(item) {
		return item.split('.')[0];
	});

	// only allow sections with an existing view file
	app.param('section', function(req, res, next, id) {
		if (editDirFileNames.indexOf(id) < 0) {
			return next('route');
		}
		req.section = id;
		next();
	});

	// only the ownder can modify a Character
	app.param('mdbwrite', function (req, res, next, id) {
		if (!/^[0-9a-fA-F]+$/.test(id)) {
			return next('route');
		}
		// if inside own Character list
		if (req.user.chars.indexOf(id) > -1) {
			req.id = id;
			next();
		}
		else {
			next(new Error("Du darfst diesen Charakter nicht editieren."));
		}
		
	});

	// read permission only for self and friends
	app.param('mdbread', function (req, res, next, id) {
		// if not an ObjectId
		if (!/^[0-9a-fA-F]+$/.test(id)) {
			return next('route');
		}
		req.id = id;
		// if inside own Character list
		if (req.user.chars.indexOf(id) > -1) {
			return next();
		}
		// if the owner of the Character is in your Friends list
		User.findOne({ chars: id }, function(err, doc) {
			if (err) return next(err);
			if (doc.friends.indexOf(req.user._id) > -1) {
				next();
			}
			else {
				next(new Error("Du darfst dir diesen Charakter nicht anschauen."));
			}
		});
	});

	// for backward compatibility
	app.param('mongoid', function (req, res, next, id) {
		if (!/^[0-9a-fA-F]+$/.test(id)) {
			return next('route');
		}
		req.id = id;
		next();
	});
};