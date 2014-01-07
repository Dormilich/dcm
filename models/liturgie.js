/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Liturgie Model

var mongoose = require("mongoose")
  , Schema   = mongoose.Schema
  ;

var liturgieSchema = new Schema({
	name: { type: String, required: true },
	grad: { type: Number, min: 1, max: 7, required: true },
	rd:   { type: String, required: true }, // Stoß-, Gebet, Andacht, Zeremonie, Zyklus
	rw:   { type: String, required: true }, // selbst, Berührung, Sicht, fern
	wd:   String,
	ziel: { type: String, required: true }, // G, P, PP, PPP, Z, ZZ, ZZZ, ...
	typ: [String] // Götter
});

module.exports = mongoose.model('Liturgie', liturgieSchema);
