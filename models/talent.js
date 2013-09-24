// Talent Model

var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  ;

function talentProbeValidator(val) {
	return (["MU", "KL", "IN", "CH", "FF", "GE", "KO", "KK"].indexOf(val) > -1);
}

var talentSchema = new Schema({
	_id:   Number,
	name:  { type: String, required: true, unique: true },
	typ:   { type: String, default: 'Metatalente' },
	probe: [{ type: String, validator: talentProbeValidator }],
	standard : { type: Boolean, default: false },
	spezialisierungen: [String]
});

module.exports = mongoose.model('Talent', talentSchema);