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