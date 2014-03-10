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
	NKWaffen  : ID('nahkampf-waffen'),
	attrName  : ID('sel_att'),
	attrWert  : ID('val_att'),
	attrKK    : ID('val_att_kk'),
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
	getBHKMod : function($rechts, $links) {
		if ($rechts.length === 1 && $links.length === 1) {
			var $rowR = $rechts.closest('tr');
			var $rowL = $links.closest('tr');
			// different skills
			if ($rowR.find('td.be').data("talent") !== $rowL.find('td.be').data("talent")) {
				return -2;
			}
			// same skill, different weapons
			if ($rowR.find('td.name').text().intersect($rowL.find('td.name').text()).length === 0) {
				return -1;
			}
		}
		return 0;
	},
	hasSameRow : function ($elem1, $elem2) {
		if ($elem1.length === 1 && $elem2.length === 1) {
			return $elem1.closest('tr').find($elem2).length === 1;
		}
		return false;
	},
	// methods
	setINI : function () {
		function getWaffenINI($input) {
			if ($input.length === 1) {
				return +$input.closest('tr').find('td.ini').data("ini");
			}
			return 0;
		}
		var bonus = 0;
		// INI-Mod of Weapon(s)
		bonus  += getWaffenINI( $("input[name='haupthand']:checked") );
		bonus  += getWaffenINI( $("input[name='nebenhand']:checked") );
		// INI-Mod through Armour
		bonus  -= kampfwerte.getBE();
		// Axxeleratus and Attributo update the INI-Basis elsewhere
		// get final INI
		var ini = +kampfwerte.iniBasis.value + +kampfwerte.iniMod.value + bonus;
		kampfwerte.iniOut.textContent = ini + " + W6";

		return ini;
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
	setWaffenAT : function ($row, radio) {
		// AT = AT-Basis (Attributo) + WM (Hauptwaffe) + WM (Parierwaffe) + Spez + AT-TaW - BE-Mod
		var $at = $row.find('td.at');
		// AT-TaW + Spez + WM (Hauptwaffe)
		var AT  = $at.data("at");
		// + AT-Basis
		AT     += +kampfwerte.atBasis.value;
		// BE
		var eBE = kampfwerte.getBE() - $row.find('td.be').data("be");
		if (eBE > 0) {
			AT -= Math.floor(eBE/2);
		}
		// WM (Parierwaffe), if selected
		if ($row.find(radio.haupt).length === 1 && radio.pws.length === 1) {
			AT += +radio.pws.closest('tr').find('td.at').data("wm");
		}
		AT     += kampfwerte.getBHKMod(radio.haupt, radio.bhk);
		$at.text(AT);
	},
	setWaffenPA : function ($row, radio, iniMod) {
		// PA = PA-Basis (Attributo) + PA-TaW (BHK/PW) + Spez + WM (Hauptwaffe) + 
		//      WM (Parierwaffe) + Axxeleratus + INI-PA-Mod - BE +
		//      SF PW / SF SK / SF BHK
		var $pa    = $row.find('td.pa');
		// PA-Basis
		var PA     = +kampfwerte.paBasis.value;
		// TaW
		var tawMod = +$pa.data("pa");
		// BE-Mod
		var eBE    =  kampfwerte.getBE() - $row.find('td.be').data("be");
		var beMod  = 0;
		if (eBE > 0) {
			beMod  = Math.floor( (eBE + 1) / 2 );
		}
		// BHK-Mod
		var bhkMod = kampfwerte.getBHKMod(radio.haupt, radio.bhk);
		// PA-Bonus for shields
		var skMod  = Math.floor( (PA + tawMod - beMod + iniMod - 12) / 3 + 0.01 )
		// main-weapon
		if ($row.find(radio.haupt).length === 1) {
			// main-weapon with parray-weapon
			if (radio.pws.length) {
				// PA-WM (Parierwaffe)
				PA += +radio.pws.closest('tr').find('td.pa').data("wm");
				// PA-Mod depending on used SF
				switch (kampfwerte.SFpws.value) {
					case "SK I":
						PA += 3; 
						PA += skMod;
						$pa.text(PA);
						return null;
					case "SK II":
						PA += 5; 
						PA += skMod;
						$pa.text(PA);
						return null;
					case "PW I":
						PA -= 1;
						break;
					case "PW II":
						PA += 2;
						break;
				}
			}
			// BHK mode
			else if (radio.bhk.length === 1) {
				// equal-ness of weapons
				PA += bhkMod;
			}
		}
		// BHK 2nd-weapon
		else if ($row.find(radio.bhk).length === 1) {
			// equal-ness of weapons
			PA += bhkMod;
			// BHK I / BHK II
			PA -= kampfwerte.SFbhk.value;
		}
		PA -= beMod;
		PA += iniMod;
		PA += tawMod;
		$pa.text(PA);
	},
	setWaffenTP : function ($row) {
		// TP = TP-Basis + Axxeleratus + TP/KK / TP/KK (Attributo)
		var $tp = $row.find('td.tp');
		// TP-Basis
		var tp  = +$tp.data("tp");
		// Axxeleratus
		if (kampfwerte.axxel.checked) {
			tp += 2;
		}
		// natural KK
		var kk  = +kampfwerte.attrKK.dataset.wert;
		// Attributo-KK
		if (kampfwerte.attrName.value === "KK") {
			kk  = +kampfwerte.attrWert.value;
		}
		// TP/KK
		tp     += Math.floor( (kk - $tp.data("kk")) / $tp.data("tpkk") + 0.05 );
		// display
		$tp.text( $tp.data("w6") + " + " + tp );
	},
	setFK : function($row) {
		
	},
	axxeleratus : function () {
		// set INI-Basis
		// copy the INI-Basis and modify it according whether the spell is active
		if (kampfwerte.axxel.checked) {
			kampfwerte.iniBasis.value *= 2;
			kampfwerte.paBasis.value   = +kampfwerte.paBasis.value  + 2; // damn you, operator overloading!
			kampfwerte.axxel.parentNode.style.backgroundColor = "red";
		}
		else {
			kampfwerte.iniBasis.value /= 2;
			kampfwerte.paBasis.value  -= 2;
			kampfwerte.axxel.parentNode.style.backgroundColor = "";
		}
		kampfwerte.calculate();
	},
	attributo : function () {
		if (!kampfwerte.attributo.checked) {
			kampfwerte.iniBasis.value = kampfwerte.iniBasis.dataset.default;
			kampfwerte.atBasis.value  = kampfwerte.atBasis.dataset.default;
			kampfwerte.paBasis.value  = kampfwerte.paBasis.dataset.default;
			kampfwerte.fkBasis.value  = kampfwerte.fkBasis.dataset.default;
			kampfwerte.axxeleratus();
		}
		else {
			$.ajax({});
		}
		// finally call axxeleratus()
	},
	calculate : function () {
		var ini    = kampfwerte.setINI();
		var iniPa  = kampfwerte.getPABonus(ini);
		// INI => PA => Ausweichen
		kampfwerte.setAusweichen(iniPa);
		var radios = {
			pws:   $("input[name='nebenhand'].pws:checked"),
			bhk:   $("input[name='nebenhand'].bhk:checked"),
			haupt: $("input[name='haupthand']:checked")
		};
		$('#nahkampf-waffen tr').each(function() {
			kampfwerte.setWaffenAT( $(this), radios );
			kampfwerte.setWaffenPA( $(this), radios, iniPa );
			kampfwerte.setWaffenTP( $(this) );
		});
	}
};

 
$('#k_axx').on("click", kampfwerte.axxeleratus);

$('#waf').on("click", 'input[type="radio"]', function() {
	var $haupt = $("input[name='haupthand']:checked");
	var $neben = $("input[name='nebenhand']:checked");
	if (kampfwerte.hasSameRow($haupt, $neben)) {
		$neben.prop("checked", false);
		return null;
	}
	kampfwerte.calculate();
});

$('#unselectLH').on("click", function() {
	$("input[name='nebenhand']:checked").prop("checked", false);
	kampfwerte.calculate();
});

// Attributo
$('#sel_att').on("change", function() {
	var wert = $(this).find('option:selected').data("wert");
	$('#val_att').val(wert);
});
