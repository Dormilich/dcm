$('#newrit').tablesorter({
	headers: {
		1: { sorter: false }
	}
});
// activate/deactivate entries
$('#tbl-rk').on("click", "input.isactive", function(evt) {
	var $row = $(this).closest('tr');
	$row.find("*[name]").prop("disabled", !this.checked);
	if (this.checked) {
		$row.removeClass("disabled");
	}
	else {
		$row.addClass("disabled");
	}
});//*/
$('#newrit').on('click', 'label', function() {
	// click is faster than label => checkbox
	var $tr    = $(this).closest('tr');
	var $check = $tr.find('input');
	if ($check.length) {
		$tr.toggleClass('selected');
	}
});
function reIndex($obj, index) {
	$obj.find('.unlock').each(function() {
		this.name = this.name.replace('{index}', index);
	});
	$obj.find('label').each(function() {
		this.htmlFor = this.htmlFor.replace('{index}', index);
	});
	var rkid = $obj.find('input[type="checkbox"]')[0];
	rkid.id  = rkid.id.replace('{index}', index);
	// default dropdown to "E"
	$obj.find('select').val('E');
}
$('#addrk').on("click", function() {
	var $src = $('#rk option').filter(':selected');
	var $row = $('#tmpl-allg tr').clone();
	var idx  = $('#tbl-rk tbody tr').length;
	reIndex($row, idx);
	$row.find('label').text($src.data("long"));
	// set values
	$row.find('.short').val($src.data("short"));
	$row.find('.long').val($src.data("long"));
	// append
	$('#tbl-rk').append($row);
	$src.remove();
});
$('#addrkz').on("click", function() {
	var $src = $('#rkz option').filter(':selected');
	var $row = $('#tmpl-tanz tr').clone();
	var idx  = $('#tbl-rk tbody tr').length;
	reIndex($row, idx);
	// set values
	$row.find('.short').val($src.data("rep-short"));
	$row.find('input.long').val($src.data("rep-long"));
	$row.find('label.long').text($src.data("rep-long"));
	// append
	$('#tbl-rk').append($row);
	$src.remove();
});
$('#addrks').on("click", function() {
	var $src  = $('#rks option').filter(':selected');
	var $rows = $('#tmpl-schm tr');
	$('#tmpl-schm tr').each(function() {
		var idx  = $('#tbl-rk tbody tr').length;
		var $row = $(this).clone();
		reIndex($row, idx);
		// set values
		$row.find('.short').val($src.data("rep-short"));
		$row.find('input.long').val( $src.data("rep-long") + "-Schamane");
		$row.find('label.long').text($src.data("rep-long") + "-Schamane");
		// append
		$('#tbl-rk').append($row);
	});
	$src.remove();
});
$("form").on("submit", function() {
	$('.isactive:not(:checked)').each(function() {
		$(this).closest('tr').find('select, input').prop('disabled', true);
	});
});
