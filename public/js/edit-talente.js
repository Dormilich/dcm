Array.prototype.intersect = function (arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Argument is not an Array.');
	}
	return this.filter(function (item) {
		return (arr.indexOf(item) > -1);
	});
};
Array.prototype.diff = function (arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Argument is not an Array.');
	}
	return this.filter(function (item) {
		return (arr.indexOf(item) === -1);
	});
};
Array.prototype.unique = function () {
	return this.filter(function (item, index, src) {
		return (src.indexOf(item) === index);
	});
};

$('#pagenav a:first').trigger('click');
$('button:disabled').prop('disabled', false);
/*
$('.tab-content').on('click', 'label', function() {
	// click is faster than label => checkbox
	var $tr    = $(this).closest('.row');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', $check.prop('checked'));
		$tr.find('.spez').prop('disabled', true);
	}
})
*/
$('.tab-content').on('click', '.isactive', function() {
	var $tr    = $(this).closest('.row');
	var $check = $(this);
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
		$tr.find('.lock').prop('disabled', true);
	}
});

$('#Nahkampf').on('change', '.row', function() {
	var taw = Number($(this).find('.nk-at').val()) + Number($(this).find('.nk-pa').val());
	$(this).find('.nk-taw').text(taw);
});

$('form').on('click', '.badge', function (evt) {
	var $ul = $(this).parent().find('ul');
	$ul.toggle();
	$(this).text($ul.find(':checked').length);
});
$('form').on('click', '.toggle-custom', function (evt) {
	var $input = $(this).next();
	$input.prop('disabled', !this.checked);
});
/*
$('form').on('click', '.badge', function (evt) {
	var $badge   = $(this);
	var $datasrc = $badge.closest('.row');
	var options  = $datasrc.data('options') || [];
	var name     = $datasrc.data('name');
	var spez     = $datasrc.data('spez') || [];
	
	if ($badge.parent().children().length < 2) {
		var $ul   = $('<ul/>').addClass('options');
		// always append a text box
		$ul.append(
			$('<li/>').append(
				$('<input>', {
					type: 'checkbox'
				})
			).append(
				$('<input>', {
					type: 	 'text',
					name: 	 name + '[]',
					disabled: true
				})
			)
		);
		var options = spez.concat(options).unique();
		if (options.length) {
			options.forEach(function(item) {
				$ul.append(
					$('<li/>').append(
						$('<label/>').append(
							$('<input>', {
								type: 	 'checkbox',
								name: 	 name + '[]',
								value:   item,
								checked: (spez.indexOf(item) > -1)
							})
						).append(item)
					)
				);
			});
			$ul.insertAfter(this);
			$ul.css('width', '15em').css('z-index', 20);
			$ul.toggle();
		}
	}
});
/*
$('.add').on('click', function() {
	var $datasrc = $(this).closest('tr');
	var options  = $datasrc.data('options');
	var $wrapper = $('<div/>').addClass('wrapper');
	var $text = $('<input type="text"/>').prop('name', $datasrc.data('name'));
	var $rem  = $('<button type="button"/>')
		.text("\u2717")
		.addClass('del')
		.on('click', function() {
			$wrapper.remove();
		})
	;
	if (options && options.length) {
		var $ul   = $('<ul/>').addClass('options');
		var $down = $('<button type="button">▼</button>');
		options.split(',').forEach(function(item) {
			$('<li/>').text(item).appendTo($ul);
		});
		$down.on('click', function() {
			$ul.toggle();
		});    
		$ul.on('click', 'li', function() {
			$text.val(this.textContent);
			$ul.hide();
		});
		$wrapper.append($rem, $ul, $text, $down);
		$wrapper.insertBefore(this);
		var style   = $text.offset();
		style.top  += $text.outerHeight();
		style.width = $text.outerWidth() - 2;
		$ul.css(style);
	}
	else {
		$wrapper.append($rem, $text);
		$wrapper.insertBefore(this);
	}
});
$('.del').on('click', function() {
	$(this.parentNode).remove();
});
*/