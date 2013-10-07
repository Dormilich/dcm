// CharData Model

var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  , IDREF    = Schema.Types.ObjectId
  ;

function lernstufeValidator(val) {
	return (["A+", "A", "B", "C", "D", "E", "F", "G", "H"].indexOf(val) > -1);
}

var heldTalentSchema = new Schema({
	_talent:   { type: IDREF,  ref: 'Talent' },
	name:      { type: String, required: true },
	wert:      { type: Number, required: true, min: -3, max: 35 },
	Lernstufe: { type: String, validator: lernstufeValidator },
	Spezialisierung: [String]
});

var heldKampftalentSchema = new Schema({
	name: { type: String, required: true },
	AT:   { type: Number, min: 0, required: true }, // = FK
	PA:   { type: Number, min: 0 },
	Lernstufe: { type: String, validator: lernstufeValidator },
	Spezialisierung:  [String]
});

var heldSprachenSchema = new Schema({
	name:        { type: String, required: true },
	wert:        { type: Number, min: 0, default: 0 },
	Lernstufe:   { type: String, validator: lernstufeValidator },
	Komplexität: { type: Number, min: 5, max: 30, required: true }
});
/*
var talentSchema = new Schema({
	name:   { type: String, required: true, unique: true },
	typ:    { type: String, default: 'Metatalente' },
	probe: [{ type: String, validator: talentProbeValidator }],
	standard : { type: Boolean, default: false },
	spezialisierungen: [String]
});
//*/
var heldDataSchema = new Schema({
	held:     { type: IDREF,   ref: 'Person' },
	disabled: { type: Boolean, default: false },
	modified: { type: Date,    default: new Date() },
	SF: {
		Kampf:       [String],
		Manöver:     [String],
		allgemein:   [String],
		magisch:     [String],
		geweiht:     [String]
	},
	AP: {
		alle: { type: Number, min: 0, required: true },
		frei: { type: Number, default: 0 }
	},
	Talente: {
		Nahkampf:     [heldKampftalentSchema],
		Fernkampf:    [heldKampftalentSchema],
		körperlich:   [heldTalentSchema],
		Gesellschaft: [heldTalentSchema],
		Natur:        [heldTalentSchema],
		Wissen:       [heldTalentSchema],
		Handwerk:     [heldTalentSchema],
		Sprachen:     [heldSprachenSchema],
		Schriften:    [heldSprachenSchema]
	}
});

module.exports = mongoose.model('Heldendaten', heldDataSchema);