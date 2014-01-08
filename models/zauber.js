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

// DCM spell mongo schema
var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  ;

function lernstufeValidator(val) {
	return (["A+", "A", "B", "C", "D", "E", "F", "G", "H"].indexOf(val) > -1);
}
function probeValidator(val) {
	return (["MU", "KL", "IN", "CH", "FF", "GE", "KO", "KK", "??"].indexOf(val) > -1);
}

var varianteSchema = new Schema({
	Name : { type: String, required: true },
	modifikation : {
		probe  : String,
		minZfW : { type: Number, min: 0, max: 25 },
		typ    : String // A, M, S, X
	},
	cast : {
		ZD  : String,
		AsP : String,
		WD  : String,
		RW  : String
	},
	Repräsentationen : [String],
	Kommentar : String
});

var zauberSchema = new Schema({
	Name  :  { type: String, required: true, unique: true }, // unique?
	Probe : [{ type: String, validator: probeValidator }],
	cast  : {
		ZD  :  { type: String, required: true },
		AsP :  { type: String, required: true },
		WD  : String,
		RW  :  { type: String, required: true }
	},
	modifikation : {
		typ : String // A, M, S, X
	},
	Komplexität : { type: String, validator: lernstufeValidator },
	Repräsentationen : [String],
	Merkmale    : [String],
	SpoMod      : [String],
	Ziel        : [String],
	Varianten   : [ varianteSchema ],
	Kommentar   : String
});

module.exports = mongoose.model('Zauber', zauberSchema);