$('table').on('click', 'label', function() {
	// click is faster than label => checkbox
	var $tr    = $(this).closest('tr');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', $check.prop('checked'));
		$tr.toggleClass('selected');
	}
}).on('click', 'input[type="checkbox"]', function() {
	var $tr    = $(this).closest('tr');
	var $check = $tr.find('.isactive');
	if ($check.length) {
		$tr.find('.unlock').prop('disabled', !$check.prop('checked'));
		$tr.toggleClass('selected');
	}
});
$('form').on('submit', function() {
	$('#template').remove();
});
$('#addlk').on('click', function() {
	var $option = $('#newlk :selected');
	var $row    = $('#template tr').clone();
	var index   = $(this).closest('table').find('#collection tr').length;
	var $sec = $row.find('input').eq(1);
	$sec.val($option.val());
	$sec.prop('id', $sec.prop('id').replace("{index}", index));
	var $lab = $row.find('label');
	$lab.text($option.val());
	$lab.prop('for', $lab.prop('for').replace("{index}", index));
	$row.find('input').eq(0).val($option.data('id'));
	$row.find('select').val('E');
	$row.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", index);
	});
	$('#collection').append($row);
});
