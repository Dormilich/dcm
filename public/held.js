function beautifyNumber(num) {
	return (num > 0 ? "+" : num < 0 ? "–" : "") + Math.abs(num);
}

String.prototype.intersect = function (str) {
	var arr = str.split(/\s+/);
	return this.split(/\s+/).filter(function(word) {
		return arr.indexOf(word) > -1;
	});
}

var ID = document.getElementById.bind(document);

var kampfwerte = {
	// DOM Elements
	axxel     : ID('k_axx'),
	attributo : ID('k_att'),
	iniAxx    : ID('iniAxx'),
	iniBasis  : ID('iniBasis'),
	iniMod    : ID('iniMod'),
	iniOut    : ID('k_ini_out'),
	atBasis   : ID('atBasis'),
	paBasis   : ID('paBasis'),
	fkBasis   : ID('fkBasis'),
	rg        : ID('k_be'),
	auswMod   : ID('auswMod'),
	auswOut   : ID('k_ausw_out'),
	SFpws     : ID('pws_typ'),
	SFbhk     : ID('bhk_typ'),
	// helper methods
	getBE : function () {
		var effBE  = 0
		  , $armor = $("input[name='panzerung']:checked")
		  , rg     = +kampfwerte.rg.value
		  , be
		  ;
		if ($armor.length === 1) {
			be = $armor.val();
			if (isFinite(be) && isFinite(rg)) {
				effBE = (be - rg) < 0 ? 0 : be - rg;
			}
			else {
				console.log("Ungültige BE-Werte.");
			}
		}
		return effBE;
	},
	getPABonus : function (ini) {
		return Math.floor( (ini - 11) / 10 + 0.01 )
	},
	hasSameRow : function ($elem1, $elem2) {
		return $elem1.closest('tr').find($elem2).length === 1;

	},
	// methods
	setINIWaffe : function () {
		var $haupt = $("input[name='haupthand']:checked");
		var $neben = $("input[name='nebenhand']:checked");
				// add INI from secondary weapon
		if ($haupt.length === 1 && $neben.length === 1) {
			if (kampfwerte.hasSameRow($haupt, $neben)) {
				$neben.prop("checked", false);
				return null;
			}
			// get ini <td>s
			var $iniHW = $haupt.closest('tr').find('td.ini');
			var $iniNW = $neben.closest('tr').find('td.ini');
			// set combined values
			$iniHW.text(
				beautifyNumber( +$iniHW.data("ini") + +$iniNW.data("ini") )
			);
		}
		// reset original values
		if ($haupt.length === 1 && $neben.length === 0) {
			// get ini <td>
			var $iniHW = $haupt.closest('tr').find('td.ini');
			// (re)set to original values
			$iniHW.text(
				beautifyNumber( +$iniHW.data("ini") )
			);
		}
	},
	setINI : function () {
		var $haupt = $("input[name='haupthand']:checked");
		var bonus  = 0;
		// INI-Mod of Weapon(s)
		if ($haupt.length === 1) {
			var zahl = +$haupt.closest('tr').find('td.ini').text().replace("–", "-");
			if (isFinite(zahl)) {
				bonus += zahl;
			}
			else {
				console.log("Ungültige Waffen-INI.");
			}
		}
		// INI-Mod through Armour
		bonus  -= kampfwerte.getBE();
		// Axxeleratus and Attributo update the INI-Basis elsewhere
		// get final INI
		var ini = +kampfwerte.iniAxx.value + +kampfwerte.iniMod.value + bonus;
		kampfwerte.iniOut.textContent = ini + " + W6";

		return ini;
	},
	setAT : function () { // reset left weapon !
		var $haupt = $("input[name='haupthand']:checked")
		  , $bhk   = $("input[name='nebenhand'].bhk:checked")
		  , $pws   = $("input[name='nebenhand'].pws:checked") // PWS => Parierwaffen & Schilde
		  ;
		if ($haupt.length === 1) {
			var $rowR  = $haupt.closest("tr")
			  , rechts = {
					$at  : $rowR.find("td.at"),
					$be  : $rowR.find("td.be"),
					name : $rowR.find("td.name").text(),
					AT   : +kampfwerte.atBasis.value
				}
			  ;
			rechts.eBE    = kampfwerte.getBE() - rechts.$be.data("be");
			rechts.talent = rechts.$be.data("talent");
			// main-weapon WM + TaW-AT + Spez
			rechts.AT += +rechts.$at.data("at")
			// armour BE
			if (rechts.eBE > 0) {
				rechts.AT -= Math.floor(rechts.eBE/2);
			}
			// side-weapon (parry/shield)
			if ($pws.length === 1) {
				// side-weapon WM
				rechts.AT += +$pws.closest("tr").find("td.at").data("wm");
			}
			// sec-weapon (2-handed)
			else if ($bhk.length === 1) {
				var $rowL = $bhk.closest("tr")
				  , links = {
						$at  : $rowL.find("td.at"),
						$be  : $rowL.find("td.be"),
						name : $rowL.find("td.name").text(),
						AT   : +kampfwerte.atBasis.value
					}
				  ;
				links.eBE    = kampfwerte.getBE() - links.$be.data("be");
				links.talent = links.$be.data("talent");
				// different weapon skills
				if (rechts.talent !== links.talent) {
					rechts.AT -= 2;
					links.AT  -= 2;
				}
				// same skill, different weapons
				else if (rechts.name.intersect(links.name).length === 0) {
					rechts.AT -= 1;
					links.AT  -= 1;
				}
				// modify sec-weapon
				// sec-weapon TaW-AT + WM + Spez
				links.AT      += +links.$at.data("at");
				// Mod according to SF Linkhand/BHK I/BHK II
				links.AT      -= kampfwerte.SFbhk.value;
				// armour BE
				if (links.eBE > 0) {
					links.AT  -= Math.floor(links.eBE/2);
				}
				// display sec-weapon
				links.$at.text(links.AT);
			}
			// display
			rechts.$at.text(rechts.AT);
		}
		
	},
	setPA : function () {

	},
	setFK : function () {

	},
	setAusweichen : function (bonus) {
		// INI modifies PA-Basis
		// Attributo modifies PA-Basis
		var ausw  = +kampfwerte.paBasis.value
		// PA-Mod through INI
		if (typeof bonus === "number") {
			ausw += bonus;
		}
		// Ausweichen-Mod through Axxeleratus
		ausw     +=  kampfwerte.axxel.checked ? 2 : 0;
		// Ausweichen-Mod through Armour
		ausw     -=  kampfwerte.getBE();
		// Ausweichen-Mod through SFs
		ausw     += +kampfwerte.auswMod.value
		// display
		kampfwerte.auswOut.textContent = ausw;
	},
	setTP : function () {

	},
	axxeleratus : function () {
		// set INI-Basis
		// copy the INI-Basis and modify it according whether the spell is active
		if (kampfwerte.axxel.checked) {
			kampfwerte.iniAxx.value  =  kampfwerte.iniBasis.value * 2;
			kampfwerte.paBasis.value = +kampfwerte.paBasis.value  + 2;
			kampfwerte.axxel.parentNode.style.backgroundColor = "red";
		}
		else {
			kampfwerte.iniAxx.value   = kampfwerte.iniBasis.value;
			kampfwerte.paBasis.value -= 2;
			kampfwerte.axxel.parentNode.style.backgroundColor = "";
		}
		kampfwerte.calculate();
	},
	attributo : function () {
		if (!kampfwerte.attributo.checked) {
			kampfwerte.iniBasis.value = ID('iniAtt').defaultValue; // buggy in Chrome !!!
			
		}
		else {
			$.ajax({});
		}
	},
	calculate : function () {
		var ini = kampfwerte.setINI();
		// INI => PA => Ausweichen
		kampfwerte.setAusweichen( kampfwerte.getPABonus(ini) );

	}
};

 
$('#k_axx').on("click", kampfwerte.axxeleratus);

$('#waf').on("click", 'input[type="radio"]', function() {
	kampfwerte.setINIWaffe();
	kampfwerte.setAT();
	kampfwerte.setPA();
});

$('#unselectLH').on("click", function() {
	$("input[name='nebenhand']:checked").prop("checked", false);
	kampfwerte.setINIWaffe();
	kampfwerte.setAT();
	kampfwerte.setPA();
});