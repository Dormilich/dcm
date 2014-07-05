$('button').prop('disabled', false);

$('.panel').on('click', 'input[type="checkbox"]', function() {
	var $tr    = $(this).closest('.row');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
		$tr.toggleClass('selected');
	}
});

$('#addlk').on('click', function() {
	var $option = $('#newlk :selected');
	var $row    = $('#template .row').clone();
	var index   = $('#collection').find('.row').length;
	var $name	= $row.find('input.isactive');
	$name.val($option.text());
	$name.prop('id', $name.prop('id').replace("{index}", index));
	var $lab 	= $row.find('label');
	$lab.text($option.text());
	$lab.prop('for', $lab.prop('for').replace("{index}", index));
	$row.find('input').eq(0).val($option.val());
	$row.find('select').val('E');
	$row.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$('#collection').append($row);
	$option.remove();
});
