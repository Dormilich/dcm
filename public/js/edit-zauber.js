$("button[type='submit']").prop("disabled", false);

$('.panel').on('click', 'input[type="checkbox"]', function (evt) {
	var $tr    = $(this).closest('.row');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
	}
});

$('#liste').on('click', 'button', function (evt) {
	var $row   = $(this).closest('.row');
	var $rep   = $row.find('select :selected');
	var index  = $('#zauber').find('li').length - 1;

	var $tpl   = $('#template li').clone();
	var $check = $tpl.find('input.isactive');
	var $label = $tpl.find('label');

	$tpl.find('.id').val($row.find('.id').val());
	$tpl.find('input.rep').val($rep.val());
	$tpl.find('div.rep').text($rep.val());
	$tpl.find('select').val($row.data('kompl'));

	$tpl.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$check.prop('id', $check.prop('id').replace("{index}", index));
	$label
		.text($row.data('name'))
		.prop('for', $label.prop('for').replace("{index}", index));
	
	$rep.remove();
	if (0 === $row.find('option').length) {
		$row.parent().remove();
	}
	$('#zauber').append($tpl);
});
/*
$('#spell_choice').on('click', '.addspez', function() {
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
		options.split('|').forEach(function(item) {
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
$('#spell_choice').on('click', 'button.del', function() {
	$(this.parentNode).remove();
});
*/