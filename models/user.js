/* 
 * The MIT License
 *
 * Copyright 2014 Bertold von Dormilich <Dormilich@netscape.net>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var mongoose = require("mongoose")
  , bcrypt   = require("bcrypt-nodejs")
  , IDREF    = mongoose.Schema.Types.ObjectId
  ;

var userSchema = mongoose.Schema({
	isAdmin : { type: Boolean, default: false },
	local   : {
		email    : { type: String, unique: true },
		password : String,
		name     : { type: String, unique: false }
	},
	facebook : {
		id       : String,
		token    : String,
		email    : String,
		name     : String
	},
	google : {
		id       : String,
		token    : String,
		email    : String,
		name     : String
	},
	openid : {
		id       : String,
		email    : String,
		name     : String
	},
	friends : [{ type: IDREF, ref: "User" }],
	chars   : [{ type: IDREF, ref: "Held" }]
});

userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getName = function () {
	var type = ["local", "google", "facebook", "openid"].filter(function(item) {
		return (this[item] && typeof this[item].name === "string");
	}, this);
	if (type.length) {
		return this[type[0]].name;
	}
	return null;
};

userSchema.methods.getEmail = function (name) {
	var order = ["local", "google", "facebook", "openid"];
	// get email from the (linked) accounts with the given name
	if ((typeof name === "string") && name.length) {
		// check which account type matches the name
		var type = order.filter(function(item) {
			return this[item] && (this[item].name === name);
		}, this);
		// if a name matches linked accounts, return the first in order
		if (type.length) {
			return this[type[0]].email;
		}
	}
	// get the first email that’s available
	var type = order.filter(function(item) {
		return (this[item] && typeof this[item].name === "string");
	}, this);
	// return name, if any
	if (type.length) {
		return this[type[0]].email;
	}
	return null;
};

module.exports = mongoose.model('User', userSchema);
