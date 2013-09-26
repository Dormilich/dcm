// DCM character mongo schema
var mongoose = require("mongoose")
  , Schema = mongoose.Schema
  ;

var personSchema = new Schema({
	Person: {
		Name:        String,
		Geschlecht:  String,
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
			name:         String,
			modifikation: String
		},
		Kultur: {
			name:         String,
			modifikation: String
		},
		Profession: {
			name:         String,
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
			start: { type: Number, min: -1 },
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
	modified:  { type: Date, default: new Date() }
});
personSchema.virtual('Basiswerte.LeP').get(function() {
	var KO  = this.Attribute.KO.wert
	  , KK  = this.Attribute.KK.wert
	  , mod = this.modifikatoren.LeP
	  ;
	return Math.round( (KO + KO + KK)/2 + mod.start + mod.add );
});
personSchema.virtual('Basiswerte.AuP').get(function() {
	var MU  = this.Attribute.MU.wert
	  , KO  = this.Attribute.KO.wert
	  , GE  = this.Attribute.GE.wert
	  , mod = this.modifikatoren.AuP
	  ;
	return Math.round( (MU + KO + GE)/2 + mod.start + mod.add );
});
personSchema.virtual('Basiswerte.AsP').get(function() {
	var MU  = this.Attribute.MU.wert
	  , IN  = this.Attribute.IN.wert
	  , CH  = this.Attribute.CH.wert
	  , mod = this.modifikatoren.AsP
	  ;
	if (!mod || mod.start === -1) {
		return null;
	}
	if (mod.sterne) {
		IN *= 2;
	}
	return Math.round( (MU + IN + CH)/2 + mod.start + mod.add );
});
personSchema.virtual('Basiswerte.KaP').get(function() {
	var mod = this.modifikatoren.KaP;
	if (!mod || mod.start === -1) {
		return null;
	}
	return Math.round( mod.start + mod.add );
});
personSchema.virtual('Basiswerte.MR').get(function() {
	var MU  = this.Attribute.MU.wert
	  , KL  = this.Attribute.KL.wert
	  , KO  = this.Attribute.KO.wert
	  , mod = this.modifikatoren.MR
	  ;
	return Math.round( (MU + KL + KO)/5 + mod.start + mod.add );
});
personSchema.virtual('Basiswerte.GS').get(function() {
	var GE  = this.Attribute.GE.wert
	  , mod = this.modifikatoren.GS
	  ;
	return Math.floor( (GE >>> 3) + 7 + mod );
});
personSchema.virtual('Kampfwerte.INI').get(function() {
	var MU = this.Attribute.MU.wert
	  , IN = this.Attribute.IN.wert
	  , GE = this.Attribute.GE.wert
	  , mod = this.modifikatoren.INI
	  ;
	return Math.round( (MU + MU + IN + GE)/5 + mod );
});
personSchema.virtual('Kampfwerte.AT').get(function() {
	var MU = this.Attribute.MU.wert
	  , GE = this.Attribute.GE.wert
	  , KK = this.Attribute.KK.wert
	  ;
	return Math.round( (MU + GE + KK)/5 );
});
personSchema.virtual('Kampfwerte.PA').get(function() {
	var IN = this.Attribute.IN.wert
	  , GE = this.Attribute.GE.wert
	  , KK = this.Attribute.KK.wert
	  ;
	return Math.round( (IN + GE + KK)/5 );
});
personSchema.virtual('Kampfwerte.FK').get(function() {
	var IN = this.Attribute.IN.wert
	  , FF = this.Attribute.FF.wert
	  , KK = this.Attribute.KK.wert
	  ;
	return Math.round( (IN + FF + KK)/5 );
});
personSchema.virtual('Kampfwerte.WS').get(function() {
	var KO  = this.Attribute.KO.wert
	  , mod = this.modifikatoren.WS
	  ;
	return Math.round( KO/2 + mod );
});

personSchema.post('init', function (doc) {
  console.log('%s has been initialized from the db', doc._id);
});
personSchema.post('validate', function (doc) {
  console.log('%s has been validated (but not saved yet)', doc._id);
});
personSchema.post('save', function (doc) {
  console.log('%s has been saved', doc._id);
});

module.exports = mongoose.model('Person', personSchema);