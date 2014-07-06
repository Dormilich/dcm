$('#spell_list')
	/*.tablesorter({
		headers: {
			4: { sorter: false },
			5: { sorter: false }
		}
	})//*/
	.on("click", 'button', function(evt) {
		var $row = $(this).closest('tr');
		var rep  = $row.find('select').val();
		var name = $row.find('.name').text();
		var id   = $row.find('.id').val();
		var kompl = $row.find('.kompl').text();
		var index = $('#spell_choice tbody tr').length;
		var $new = $('#spell_template').clone().removeAttr('id');
		
		$new.find('input.id').val(id);
		$new.find('label.name').text(name);
		$new.find('input.rep').val(rep).next().text(rep);
		// $new.find('label.rep').text(rep);
		$new.find('td.kompl').text(kompl);
		$new.find('select.lern').val(kompl);
		
		$new.find('*[name]').each(function() {
			this.name = this.name.replace("{index}", index);
		});
		
		$new.appendTo('#spell_choice');
		$row.find("option[value='" + rep + "']").remove();
	})
;
$('#spell_choice')
	/*.tablesorter({
		headers: {
			2: { sorter: false },
			4: { sorter: false },
			5: { sorter: false }
		}
	})//*/
	.on("click", "input.lock", function(evt) {
		var $row = $(this).closest('tr');
		$row.find("*[name]").prop("disabled", !this.checked);
		if (this.checked) {
			$row.removeClass("disabled");
		}
		else {
			$row.addClass("disabled");
		}
	})
;
$("button[type='submit']").prop("disabled", false);
$("#newSpell").on("submit", function() {
	$('#spell_template').remove();
	$('#spell_choice').trigger("sorton", [[[0,0], [1,0]]]);
	$('.isactive:not(:checked)').each(function() {
		$(this).closest('tr').find('select, input').prop('disabled', true);
	});
});
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
