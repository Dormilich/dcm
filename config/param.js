var path    = require('path')
  , appRoot = path.dirname(require.main.filename)
  , User    = require( path.join(appRoot, 'models/user') )
  ;

module.exports = function (app) {

	function realpath(relativePath) {
		return path.join(appRoot, relativePath);
	}

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
		if (req.user.chars.indexOf(id) < 0) {
			next(new Error("Du darfst diesen Charakter nicht editieren."));
		}
		req.id = id;
		next();
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
			if (req.user.friends.indexOf(doc._id)) {
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