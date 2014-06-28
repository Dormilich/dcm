$('.tab-content').on('click', 'label', function() {
	// click is faster than label => checkbox
	var $tr    = $(this).closest('.row');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', $check.prop('checked'));
		$tr.find('.spez').prop('disabled', true);
	}
}).on('click', 'input[type="checkbox"]', function() {
	var $tr    = $(this).closest('.row');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
		$tr.find('.spez').prop('disabled', true);
	}
});

$('#Nahkampf').on('change', '.row', function() {
	var taw = Number($(this).find('.nk-at').val()) + Number($(this).find('.nk-pa').val());
	$(this).find('.nk-taw').text(taw);
});

$('#Nahkampf .row').each(function() {
	var taw = Number($(this).find('.nk-at').val()) + Number($(this).find('.nk-pa').val());
	$(this).find('.nk-taw').text(taw);
});

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
