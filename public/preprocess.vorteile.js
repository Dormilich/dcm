// auto-check boxes when child values are changed
(function($) {
	$('button:disabled').prop('disabled', false);
	$('.vor_nach input[type="radio"]').on('click', function(jqevt) {
		$(this.parentNode)
			.prevAll('input[name*="teile"]')
			.prop('checked', true);
	});
	$('.vor_nach input[type="number"]').on('change', function(jqevt) {
		$(this)
			.prevAll('input[name*="teile"]')
			.prop('checked', true);
	});
})($);
// modify values of checked fields
$('#newChar').on('submit', function(jqevt) {
	function wrapValue(val) {
		var open  = '', close = '';
		if (arguments.length === 3) {
			open  = arguments[1];
			close = arguments[2];
		}
		return ' ' + open + val + close;
	}
	function compactList($list, open, close) {
		if ($list.length) {
			var text_val = $list.filter(function() {
				return this.value.trim() !== '';
			}).map(function() {
				return this.value;
			}).get().join(', ');
			if (text_val.length) {
				return wrapValue(text_val, open, close);
			}
		}
		return false;
	}
	function wrapList(open, close) {
		return function() {
			var $boxes = $(this).nextAll('ul').find('input:checked');
			var val    = compactList($boxes, open, close);
			if (val) {
				this.value += val;
			}
			else {
				this.checked = false;
			}
		};
	}
	// add explanation/specifics
	$('.spezifisch:checked').each(function() {
		var $text = $(this).nextAll('input[type="text"]');
		if ($text.length) {
			this.value += wrapValue($text.val(), '(', ')');
		}
	});
	// value completion
	$('.zusatz:checked').each(function() {
		var $radio = $(this).closest('li').find('input[type="radio"]:checked');
		if ($radio.length) {
			this.value += wrapValue($radio.val());
		}
		else {
			this.checked = false;
		}
	});
	// add number fields
	$('.stufe:checked').each(function() {
		var $num = $(this).nextAll('input[type="number"]');
		if ($num.length) {
			this.value += wrapValue($num.val(), '[', ']');
		}
	});
	// add primary selects
	$('.auswahl_liste:checked').each(function() {
		var selection = $(this).nextAll('select').val();
		if ($.isArray(selection)) {
			selection = selection.join(', ');
		}
		if (selection) {
			this.value += wrapValue(selection, '[', ']');
		}
	});
	// add multiple text fields
	$('.auswahl_text:checked').each(function() {
		var $texts = $(this).closest('li').find('input[type="text"]');
		var val    = compactList($texts, '[', ']');
		if (val) {
			this.value += val;
		}
		else {
			this.checked = false;
		}
	});
	// collect values from sub-list
	$('.sammeln-alle:checked').each( wrapList('(', ')') );
	$('.sammeln-eins:checked').each( wrapList('[', ']') );
	$('.sammeln-nowrap:checked').each( wrapList('', '') );
	// clean up
	$('.vor_nach input[type="radio"]').prop('checked', false);
});