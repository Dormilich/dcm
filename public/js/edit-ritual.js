$('button').prop('disabled', false);

$('.panel').on('click', 'input[type="checkbox"]', function() {
	var $tr    = $(this).closest('.row');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
		$tr.toggleClass('selected');
	}
});

function copyStd(data)
{
	var $row   = $('#templates .std').clone();
	var $check = $row.find('input.isactive');
	var $label = $row.find('label');
	
	$row.find('input.long').val(data.long);
	$row.find('input.short').val(data.short);

	$row.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", data.index);
	});
	$check.prop('id', $check.prop('id').replace("{index}", data.index));

	$label.text(data.long);
	$label.prop('for', $label.prop('for').replace("{index}", data.index));

	if (data.short === 'Srl' || data.short === 'Alc') {
		$row.find('select').val('D');
	}
	else {
		$row.find('select').val('E');
	}

	return $row;
}

function copyZtz(data)
{
	var $row   = $('#templates .ztz').clone();
	var $check = $row.find('input.isactive');
	var $label = $row.find('label');
	
	$row.find('input.long').val(data.repLong);
	$row.find('input.short').val(data.repShort);

	$row.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", data.index);
	});
	$check.prop('id', $check.prop('id').replace("{index}", data.index));

	$label.text($label.text() + ' (' + data.repLong + ')');
	$label.prop('for', $label.prop('for').replace("{index}", data.index));

	$row.find('select').val('E');

	return $row;
}

function copyShm(data)
{
	var $row   = $('#templates .shm').clone();
	var $check = $row.find('input.isactive');
	var $label = $row.find('label');
	var index;
	
	$row.find('input.long').val(data.repLong);
	$row.find('input.short').val(data.repShort);

	index  = data.index;
	$row.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", index++);
	});
	index = data.index;
	$check.each(function () {
		this.id = this.id.replace("{index}", index++);
	});
	index = data.index;
	$label.each(function () {
		this.textContent += ' (' + data.repLong + ')';
		this.htmlFor      = this.htmlFor.replace("{index}", index++)
	});
	
	$row.find('select').val('E');

	return $row;
}

$('#addrk').on('click', function () {
	var $option = $('#newrk :selected');
	$option.data('index', $('#collection').find('.row').length);

	switch ($option.data('short')) {
		case 'Ztz':
			var $row = copyZtz($option.data());
		break;
		case 'Shm':
			var $row = copyShm($option.data());
		break;
		default:
			var $row = copyStd($option.data());
	}
	$('#collection').append($row);
	$option.remove();
});
