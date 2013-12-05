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