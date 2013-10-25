// Talent Model

var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  ;

function talentProbeValidator(val) {
	return (["MU", "KL", "IN", "CH", "FF", "GE", "KO", "KK"].indexOf(val) > -1);
}
function lernstufeValidator(val) {
	return (["A+", "A", "B", "C", "D", "E", "F", "G", "H"].indexOf(val) > -1);
}

var talentSchema = new Schema({
	name:   { type: String, required: true },
	typ:    { type: String, required: true },
	probe: [{ type: String, validator: talentProbeValidator }],
	standard : { type: Boolean, default: false },
	spezialisierungen: [String],
	stufe: { type: String, validator: lernstufeValidator }
});

module.exports = mongoose.model('Talent', talentSchema);