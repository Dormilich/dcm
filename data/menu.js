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

module.exports = {
	default: {
		left: [{
			url:   "/",
			title: "Startseite",
			sign:  ["fa", "fa-home"]
		}, {
			url:   "/login",
			title: "Anmelden",
			sign:  ["fa", "fa-sign-in"]
		}, {
			url:   "/auth/google",
			title: "Google",
			sign:  ["fa", "fa-google-plus-square"]
		/*}, {
			url:   "/auth/facebook",
			title: "facebook",
			sign:  ["fa", "fa-facebook-square"]
		}, {
			url:   "/login/openid",
			title: "OpenID"//*/
		}],
		right: [{
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	profil: {
		left: [{
			url:   "/helden",
			title: "Helden"
		}, {
			url:   "/freunde",
			title: "Freunde {badge}"
		}, {
			url:   "/profil",
			title: "Konten"
		/*}, {
			url:   "/messages",
			title: "Nachrichten"//*/
		}],
		right: [{
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		/*}, {
			url:   "/rss",
			title: "Update-Feed",
			sign:  ["fa", "fa-rss-square", "text-warning"]//*/
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	helden: {
		left: [{
			title: "{name}",
			dropdown: [{
				url:   "#bes",
				title: "Beschreibung"
			}, {
				url:   "#gen",
				title: "Generierung"
			}, {
				url:   "#att",
				title: "Attribute"
			}, {
				url:   "#bas",
				title: "Basiswerte"
			}, {
				url:   "#vt",
				title: "Vorteile"
			}, {
				url:   "#nt",
				title: "Nachteile"
			}, {
				url:   "#ap",
				title: "Abenteuerpunkte"
			}, {
				url:   "#sf",
				title: "Sonderfertigkeiten"
			}, {
				url:   "#waf",
				title: "Waffen & Rüstungen"
			}, {
				url:   "#taw",
				title: "Talentwerte"
			}, { // a divider
			}, {
				url:   "#t_nk",
				title: "Nahkampf-Talente"
			}, {
				url:   "#t_fk",
				title: "Fernkampf-Talente"
			}, {
				url:   "#t_koe",
				title: "Körperliche Talente"
			}, {
				url:   "#t_ges",
				title: "Gesellschaftstalente"
			}, {
				url:   "#t_nat",
				title: "Naturtalente"
			}, {
				url:   "#t_wis",
				title: "Wissenstalente"
			}, {
				url:   "#t_han",
				title: "Handwerkstalente"
			}, {
				url:   "#t_spr",
				title: "Sprachen"
			}, {
				url:   "#t_scr",
				title: "Schriften"
			}, { // a divider
			}, {
				url:   "#eqp",
				title: "Ausrüstung"
			}]
		}, {
			url:   "/helden",
			title: "Meine Helden"
		}],
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/person/{id}",
				title: "Beschreibung"
			}, {
				url:   "/generierung/{id}",
				title: "Generierung"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}, {
				url:   "/ap/{id}",
				title: "Abenteuerpunkte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/talente/{id}",
				title: "Talente"
			}, {
				url:   "/waffen/{id}",
				title: "Waffen"
			}, {
				url:   "/kleidung/{id}",
				title: "Rüstungen"
			}, {
				url:   "/rucksack/{id}",
				title: "Gegenstände"
			}]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	weihe: {
		left: [{
			title: "{name}",
			dropdown: [{
				url:   "#vt",
				title: "Vorteile"
			}, {
				url:   "#nt",
				title: "Nachteile"
			}, {
				url:   "#sf",
				title: "Sonderfertigkeiten"
			}, {
				url:   "#att",
				title: "Attribute"
			}, {
				url:   "#bas",
				title: "Basiswerte"
			}, {
				url:   "#lkw",
				title: "Liturgiekenntnis"
			}, {
				url:   "#lit",
				title: "Liturgien"
			}]
		}, {
			url:   "/helden",
			title: "Meine Helden"
		}],
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/liturgien/{id}#lkw",
				title: "Liturgiekenntnis"
			}, {
				url:   "/liturgien/{id}#lit",
				title: "Liturgien"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	magie: {
		left: [{
			title: "{name}",
			dropdown: [{
				url:   "#vt",
				title: "Vorteile"
			}, {
				url:   "#nt",
				title: "Nachteile"
			}, {
				url:   "#sf",
				title: "Sonderfertigkeiten"
			}, {
				url:   "#att",
				title: "Attribute"
			}, {
				url:   "#bas",
				title: "Basiswerte"
			}, {
				url:   "#zbr",
				title: "Zauber"
			}, {
				url:   "#rkw",
				title: "Ritualkenntnis"
			}, {
				url:   "#rit",
				title: "Rituale"
			}]
		}, {
			url:   "/helden",
			title: "Meine Helden"
		}],
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/zauber/{id}#zbr",
				title: "Zauber"
			}, {
				url:   "/rituale/{id}#rkw",
				title: "Ritualkenntnis"
			}, {
				url:   "/rituale/{id}#rit",
				title: "Rituale"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	neu: {
		left: [{
			title: "Neuer Held",
			dropdown: [{
				url:   "#bes",
				title: "Beschreibung"
			}, {
				url:   "#gen",
				title: "Generierung"
			}, {
				url:   "#att",
				title: "Attribute"
			}, {
				url:   "#bas",
				title: "Basiswerte"
			}, {
				url:   "#vt",
				title: "Vorteile"
			}, { // a divider
			}, {
				url:   "#pc_1",
				title: "A – E"
			}, {
				url:   "#pc_22",
				title: "F – J"
			}, {
				url:   "#pc_42",
				title: "K – O"
			}, {
				url:   "#pc_50",
				title: "P – T"
			}, {
				url:   "#vorteil_78",
				title: "U – Z"
			}, { // a divider
			}, {
				url:   "#nt",
				title: "Nachteile"
			}, { // a divider
			}, {
				url:   "#pc_69",
				title: "A – E"
			}, {
				url:   "#pc_95",
				title: "F – J"
			}, {
				url:   "#pc_109",
				title: "K – O"
			}, {
				url:   "#pc_131",
				title: "P – T"
			}, {
				url:   "#pc_158",
				title: "U – Z"
			}, { // a divider
			}, {
				url:   "#top",
				title: "Seitenanfang"
			}, {
				url:   "#save",
				title: "speichern"
			}]
		}, {
			url:   "/helden",
			title: "Meine Helden"
		}, {
			url:   "/neu",
			title: "Neuer Held"
		}],
		right: [{
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	edit: {
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/person/{id}",
				title: "Beschreibung"
			}, {
				url:   "/generierung/{id}",
				title: "Generierung"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}, {
				url:   "/ap/{id}",
				title: "Abenteuerpunkte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/talente/{id}",
				title: "Talente"
			}, {
				url:   "/waffen/{id}",
				title: "Waffen"
			}, {
				url:   "/kleidung/{id}",
				title: "Rüstungen"
			}, {
				url:   "/rucksack/{id}",
				title: "Gegenstände"
			}]
		}, {
			url:   "#top",
			title: "Seitenanfang",
			sign:  ["fa", "fa-hand-o-up"]
		}, {
			url:   "#save",
			title: "Speichern",
			sign:  ["fa", "fa-floppy-o"]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	liturgien: {
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/liturgien/{id}#lkw",
				title: "Liturgiekenntnis"
			}, {
				url:   "/liturgien/{id}#lit",
				title: "Liturgien"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}]
		}, {
			url:   "#top",
			title: "Seitenanfang",
			sign:  ["fa", "fa-hand-o-up"]
		}, {
			url:   "#save",
			title: "Speichern",
			sign:  ["fa", "fa-floppy-o"]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	zauber: {
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/zauber/{id}#zbr",
				title: "Zauber"
			}, {
				url:   "/rituale/{id}#rkw",
				title: "Ritualkenntnis"
			}, {
				url:   "/rituale/{id}#rit",
				title: "Rituale"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}]
		}, {
			url:   "#top",
			title: "Seitenanfang",
			sign:  ["fa", "fa-hand-o-up"]
		}, {
			url:   "#save",
			title: "Speichern",
			sign:  ["fa", "fa-floppy-o"]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	},
	rituale: {
		right: [{
			title: "{name} bearbeiten",
			dropdown: [{
				url:   "/rituale/{id}#rkw",
				title: "Ritualkenntnis"
			}, {
				url:   "/rituale/{id}#rit",
				title: "Rituale"
			}, {
				url:   "/attribute/{id}",
				title: "Attribute"
			}, {
				url:   "/basiswerte/{id}",
				title: "Basiswerte"
			}, {
				url:   "/sf/{id}",
				title: "Sonderfertigkeiten"
			}, {
				url:   "/procon/{id}",
				title: "Vor- & Nachteile"
			}]
		}, {
			url:   "#top",
			title: "Seitenanfang",
			sign:  ["fa", "fa-hand-o-up"]
		}, {
			url:   "#save",
			title: "Speichern",
			sign:  ["fa", "fa-floppy-o"]
		}, {
			url:   "/about",
			title: "Info",
			sign:  ["fa", "fa-info-circle", "text-info"]
		}, {
			url:   "/logout",
			title: "Abmelden",
			sign:  ["fa", "fa-sign-out"]
		}]
	}
};