function beautifyNumber(num) {
	return (num > 0 ? "+" : num < 0 ? "–" : "") + Math.abs(num);
}

var ID = document.getElementById.bind(document);

var kampfzauber = {
	// DOM Elements
	axxel     : ID('k_axx'),
	attributo : ID('k_att'),
	iniAxx    : ID('iniAxx'),
	iniAtt    : ID('iniAtt'),
	iniMod    : ID('iniMod'),
	iniOut    : ID('k_ini_out'),
	paBasis   : ID('paBasis'),
	rg        : ID('k_be'),
	auswMod   : ID('auswMod'),
	auswOut   : ID('k_ausw_out'),
	// helper methods
	getBE : function () {
		var effBE  = 0
		  , $armor = $("input[name='panzerung']:checked")
		  , rg     = +kampfzauber.rg.value
		  , be
		  ;
		if ($armor.length === 1) {
			be = Math.round($armor.val());
			if (isFinite(be) && isFinite(rg)) {
				effBE = (be - rg) < 0 ? 0 : be - rg;
			}
			else {
				console.log("Ungültige BE-Werte.");
			}
		}
		return effBE;
	},
	// methods
	setINIWaffe : function () {
		var $haupt = $("input[name='haupthand']:checked");
		var $neben = $("input[name='haupthand']:checked");
		// add INI from secondary weapon
		if ($haupt.length === 1 && $neben.length === 1) {
			// get dataset items
			var $trHW = $haupt.closest('tr');
			var $trNW = $neben.closest('tr');
			// set new values
			$trHW.find('td.ini').text(
				beautifyNumber( +$trHW.data("ini") + +$trNW.data("ini") )
			);
		}
		if ($haupt.length === 1 && $neben.length === 0) {
			// get dataset items
			var $trHW = $haupt.closest('tr');
			// (re)set to original values
			$trHW.find('td.ini').text(
				beautifyNumber( +$trHW.data("ini") )
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
		bonus  -= kampfzauber.getBE();
		// Axxeleratus and Attributo update the INI-Basis elsewhere
		// get final INI
		var ini = +kampfzauber.iniAxx.value + +kampfzauber.iniMod.value + bonus;
		kampfzauber.iniOut.textContent = ini + " + W6";
		// set PA-BAsis through high INI
		// floating point arithmetics !
		kampfzauber.paBasis.value = +kampfzauber.paBasis.value + Math.floor( (ini - 11) / 10 + 0.01 );

		return ini;
	},
	setAT : function () {

	},
	setPA : function () {

	},
	setFK : function () {

	},
	setAusweichen : function () {
		// INI modifies PA-Basis
		// Attributo modifies PA-Basis
		var ausw = +kampfzauber.paBasis.value
		// Ausweichen-Mod through Axxeleratus
		ausw    +=  kampfzauber.axxel.checked ? 2 : 0;
		// Ausweichen-Mod through Armour
		ausw    -=  kampfzauber.getBE();
		// Ausweichen-Mod through SFs
		ausw    += +kampfzauber.auswMod.value
		// display
		kampfzauber.auswOut.textContent = ausw;
	},
	setTP : function () {

	},
	axxeleratus : function () {
		// set INI-Basis
		// copy the INI-Basis and modify it according whether the spell is active
		if (kampfzauber.axxel.checked) {
			kampfzauber.iniAxx.value  =  kampfzauber.iniAtt.value * 2;
			kampfzauber.paBasis.value = +kampfzauber.paBasis.value + 2;
		}
		else {
			kampfzauber.iniAxx.value   = kampfzauber.iniAtt.value;
			kampfzauber.paBasis.value -= 2;
		}
	},
	attributo : function () {
		if (!kampfzauber.attributo.checked) {
			kampfzauber.iniAtt.value = ID('iniAtt').defaultValue; // buggy in Chrome !!!
			
		}
		else {
			$.ajax({});
		}
	}
};

 
$('#k_axx').on("click", kampfzauber.axxeleratus);
//$('#waf').on("click", 'input[type="radio"]', modifyWeaponValues);