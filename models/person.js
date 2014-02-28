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

// DCM character mongo schema
var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  , IDREF    = Schema.Types.ObjectId
  ;

function lernstufeValidator(val) {
	return (["A+", "A", "B", "C", "D", "E", "F", "G", "H"].indexOf(val) > -1);
}

/*************************************
 ***            Talente            ***
 *************************************/
var TalentSchema = new Schema({
	_talent:   { type: IDREF,  ref: 'Talent' },
	wert:      { type: Number, min: -3, max: 35 },
	Lernstufe: { type: String, validator: lernstufeValidator },
	Spezialisierung: [String],
	name:  String,
	AT:   { type: Number, min: 0 }, // = FK
	PA:   { type: Number, min: 0 },
	Komplexität: { type: Number, min: 5, max: 30 }
});
TalentSchema.virtual('TaW').get(function() {
	if (typeof this.AT === "number") {
		if (typeof this.PA === "number") {
			return this.AT + this.PA;
		}
		return this.AT;
	}
	else if (typeof this.wert === "number") {
		return this.wert;
	}
	else  {
		return "—";
	}
});
TalentSchema.virtual('TaW').set(function(value) {
	this.wert = value;
});

/*************************************
 ***            Zauber             ***
 *************************************/
var ZauberSchema = new Schema({
	_zauber:        { type: IDREF, ref: 'Zauber', required: true },
	ZfW:            { type: Number, min: 0, max: 35, default: 0 },
	Lernstufe:      { type: String, validator: lernstufeValidator },
	Spezialisierung: [String],
	Repräsentation: { type: String, required: true }
});
ZauberSchema.virtual('Varianten').get(function() {
	var _variants = this._zauber.Varianten
	  , _rep      = this.Repräsentation
	  ;
	if (typeof _variants === 'string') {
		_variants = [this.Varianten];
	}
	if (!Array.isArray(_variants)) {
		return [];
	}
	return _variants.filter(function(item) {
		return (item.Reps.indexOf(_rep) !== -1);
	});
});

/*************************************
 ***        Nahkampfwaffen         ***
 *************************************/
var WaffenNKSchema = new Schema({
	Name:    String,
	talent:  String,
	spez:    { type: Boolean, default: false },
	BE:      { type: Number,  max: 0 },
	DK:      String,
	BF:      Number,
	INI:     Number,
	WM: {
		AT:  Number,
		PA:  Number
	},
	TP: {
		roll:    String,
		rollMod: Number,
		kk:    { type: Number, min: 0 },
		kkMod: { type: Number, min: 0 }
	}
});

/*************************************
 ***    Schilde & Parierwaffen     ***
 *************************************/
var WaffenLHSchema = new Schema({
	Name:   String,
	talent: String,
	BF:     Number,
	INI:    Number,
	WM: {
		AT: Number,
		PA: Number
	}
});

/*************************************
 ***        Fernkampfwaffen        ***
 *************************************/
var WaffenFKSchema = new Schema({
	Name:    String,
	Laden:   String,
	talent:  String,
	spez:    { type: Boolean, default: false },
	BE:      { type: Number,  max: 0 },
	WM: {
		AT:  Number
	},
	TP: {
		roll:    String,
		rollMod: Number,
		kk:    { type: Number, min: 0 },
		kkMod: { type: Number, min: 0 },
		kkAtt: { type: String, default: "KK" },
		dk:      [Number],
		dkMod:   [String]
	}
});

/*************************************
 ***           Rüstungen           ***
 *************************************/
var RüstungSchema = new Schema({
	Name: String,
	Ko: { type: Number, min: 0 },
	Br: { type: Number, min: 0 },
	Rü: { type: Number, min: 0 },
	Ba: { type: Number, min: 0 },
	LA: { type: Number, min: 0 },
	RA: { type: Number, min: 0 },
	LB: { type: Number, min: 0 },
	RB: { type: Number, min: 0 },
	BE: { type: Number, min: 0 },
	RS: { type: Number, min: 0 }
});

/*************************************
 ***             Held              ***
 *************************************/
var heldSchema = new Schema({
	disabled: { type: Boolean, default: false },
	modified: { type: Date,    default: new Date() },
	Person: {
		Name: { type: String, required: true },
		Geschlecht:   String,
		Größe:     { type: Number, min: 25, max: 250 },
		Gewicht:   { type: Number, min: 20, max: 300 },
		Tsatag:  {
			tag:   { type: Number, min: 1, max: 30 },
			monat: { type: Number, min: 0, max: 12 }, // 12 => Namenlose Tage
			jahr:  { type: Number }
		},
		Alter:     { type: Number, min:  12 },
		Haarfarbe:   String,
		Augenfarbe:  String,
		Aussehen:    String,
		Hintergrund: String,
		Titel:       String,
		SO:  { type: Number, min: 0, max: 20 }
	},
	Generierung: {
		Rasse: {
			name: { type: String, required: true },
			modifikation: String
		},
		Kultur: {
			name: { type: String, required: true },
			modifikation: String
		},
		Profession: {
			name: { type: String, required: true },
			modifikation: String
		},
		BgB: {
			name:         String,
			modifikation: String
		}
	},
	Attribute: {
		MU: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		KL: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		IN: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		CH: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		FF: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		GE: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		KO: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		},
		KK: {
			wert:  { type: Number, min: 0 },
			start: { type: Number, min: 0, default: 8 },
			mod:   { type: Number, min: -10, max: 10, default: 0 }
		}
	},
	modifikatoren: {
		LeP: {
			start: { type: Number, min: 0 }, // LeP-Modifikator
			add:   { type: Number, min: 0, default: 0 },
			max:   { type: Number, min: 0 }
		},
		AuP: {
			start: { type: Number, min: 0 },
			add:   { type: Number, min: 0, default: 0 },
			max:   { type: Number, min: 0 }
		},
		AsP: {
			start: { type: Number },
			add:   { type: Number, min:  0 },
			max:   { type: Number, min:  0 },
			sterne:{ type: Boolean }
		},
		KaP: {
			start: { type: Number, min: -1 },
			add:   { type: Number, min:  0 }
		},
		MR: {
			start: { type: Number, min: -10, max: 10 },
			add:   { type: Number, min: 0, default: 0 },
			max:   { type: Number, min: 0 }
		},
		INI: { type: Number, min: 0, max: 6, default: 0 },
		WS:  { type: Number, default: 0 },
		GS:  { type: Number, default: 0 }
	},
	Vorteile:  [String],
	Nachteile: [String],
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
		Nahkampf:     [TalentSchema],
		Fernkampf:    [TalentSchema],
		körperlich:   [TalentSchema],
		Gesellschaft: [TalentSchema],
		Natur:        [TalentSchema],
		Wissen:       [TalentSchema],
		Handwerk:     [TalentSchema],
		Sprachen:     [TalentSchema],
		Schriften:    [TalentSchema],
		Gaben:        [TalentSchema]
	},
	Weihe : {
		Liturgiekenntnis: [TalentSchema],
		Liturgien: [{ type: IDREF, ref: 'Liturgie' }]
	},
	Magie : {
		Zauber: [ZauberSchema],
		Repräsentation: [{
			short: { type: String, required: true },
			long:  { type: String, required: true }
		}],
		Ritualkenntnis: [{
			short:     { type: String, required: true }, // z.B. Hex, Mag, Ztz, Smn
			long:        String,
			RkW:       { type: Number, min: 0, max: 35, required: true },
			Lernstufe: { type: String, validator: lernstufeValidator },
			// für Schamanen
			_talent:   { type: IDREF,  ref: 'Talent' },
			// und Zaubertänzer
			tradition:   String // Ork, Wdm, Haz, Tul
		}],
		Rituale: [{ type: IDREF, ref: 'Ritual' }]
	},
	Ausrüstung : {
		Nahkampf  : [WaffenNKSchema],
		LinkeHand : [WaffenLHSchema],
		Fernkampf : [WaffenFKSchema],
		Kleidung  : [RüstungSchema],
		Rucksack  : [{
			Name  : { type: String, required: true },
			Anzahl: { type: Number, min: 0, default: 1 },
			Kommentar: String
		}]
	}
});
heldSchema.virtual('Basiswerte.LeP').get(function() {
	var KO  = this.Attribute.KO.wert
	  , KK  = this.Attribute.KK.wert
	  , mod = this.modifikatoren.LeP
	  ;
	return Math.round( (KO + KO + KK)/2 + mod.start + mod.add );
});
heldSchema.virtual('Basiswerte.AuP').get(function() {
	var MU  = this.Attribute.MU.wert
	  , KO  = this.Attribute.KO.wert
	  , GE  = this.Attribute.GE.wert
	  , mod = this.modifikatoren.AuP
	  ;
	return Math.round( (MU + KO + GE)/2 + mod.start + mod.add );
});
heldSchema.virtual('Basiswerte.AsP').get(function() {
	var MU  = this.Attribute.MU.wert
	  , IN  = this.Attribute.IN.wert
	  , CH  = this.Attribute.CH.wert
	  , mod = this.modifikatoren.AsP
	  ;
	if (!mod) {
		return null;
	}
	if (mod.sterne) {
		IN *= 2;
	}
	return Math.round( (MU + IN + CH)/2 + mod.start + mod.add );
});
heldSchema.virtual('Basiswerte.KaP').get(function() {
	var mod = this.modifikatoren.KaP;
	if (!mod) {
		return null;
	}
	return Math.round( mod.start + mod.add );
});
heldSchema.virtual('Basiswerte.MR').get(function() {
	var MU  = this.Attribute.MU.wert
	  , KL  = this.Attribute.KL.wert
	  , KO  = this.Attribute.KO.wert
	  , mod = this.modifikatoren.MR
	  ;
	return Math.round( (MU + KL + KO)/5 + mod.start + mod.add );
});
heldSchema.virtual('Basiswerte.GS').get(function() {
	var GE  = this.Attribute.GE.wert
	  , mod = this.modifikatoren.GS
	  , GS  = 8
	  ;
	if (GE < 10) {
		GS -= 1;
	}
	else if (GE > 15) {
		GS += 1;
	}
	return GS + mod;
});
heldSchema.virtual('Kampfwerte.INI').get(function() {
	var MU = this.Attribute.MU.wert
	  , IN = this.Attribute.IN.wert
	  , GE = this.Attribute.GE.wert
	  , mod = this.modifikatoren.INI
	  ;
	return Math.round( (MU + MU + IN + GE)/5 + mod );
});
heldSchema.virtual('Kampfwerte.AT').get(function() {
	var MU = this.Attribute.MU.wert
	  , GE = this.Attribute.GE.wert
	  , KK = this.Attribute.KK.wert
	  ;
	return Math.round( (MU + GE + KK)/5 );
});
heldSchema.virtual('Kampfwerte.PA').get(function() {
	var IN = this.Attribute.IN.wert
	  , GE = this.Attribute.GE.wert
	  , KK = this.Attribute.KK.wert
	  ;
	return Math.round( (IN + GE + KK)/5 );
});
heldSchema.virtual('Kampfwerte.FK').get(function() {
	var IN = this.Attribute.IN.wert
	  , FF = this.Attribute.FF.wert
	  , KK = this.Attribute.KK.wert
	  ;
	return Math.round( (IN + FF + KK)/5 );
});
heldSchema.virtual('Kampfwerte.WS').get(function() {
	var KO  = this.Attribute.KO.wert
	  , mod = this.modifikatoren.WS
	  ;
	return Math.round( KO/2 + mod );
});

/*************************************
 ***           DB-Events           ***
 *************************************/
heldSchema.post('update', function (doc) {
  console.log('%s has been updated', doc.Person.Name);
});
heldSchema.post('save', function (doc) {
  console.log('%s has been saved', doc.Person.Name);
});

/*************************************
 ***            Export             ***
 *************************************/
module.exports = mongoose.model('Held', heldSchema);