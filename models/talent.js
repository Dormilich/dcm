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
	stufe: { type: String, validator: lernstufeValidator },
	komplexität: { type: Number, min: 1, max: 30 }
});

module.exports = mongoose.model('Talent', talentSchema);