// DCM spell mongo schema
var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  , IDREF    = Schema.Types.ObjectId
  ;

function lernstufeValidator(val) {
	return (["A+", "A", "B", "C", "D", "E", "F", "G", "H"].indexOf(val) > -1);
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
	Reps : [String]
});

var zauberSchema = new Schema({
	Name  :  { type: String, required: true }, // unique?
	Probe : [{ type: String, validator: lernstufeValidator }],
	cast  : {
		ZD  :  { type: String, required: true },
		AsP :  { type: String, required: true },
		WD  : String,
		RW  :  { type: String, required: true }
	},
	modifikation : {
		typ : String // A, M, S, X
	},
	Reps      : [String],
	Merkmale  : [String],
	SpoMod    : [String],
	Ziel      : [String],
	Varianten : [ Variante ],
	Kommentar : String
});

module.exports = mongoose.model('Zauber', zauberSchema);