$('form').on("submit", function() {
	$(this).find("tfoot").remove();
	$(this).find("input[type='number']").each(function() {
		if (0 == this.value) {
			$(this).closest("tr").remove();
		}
	});
});
$('#add').on("click", function() {
	var idx  = $(this).closest('table').find('tbody tr').length;
	var $row = $(this).closest('tr');
	var $tr  = $row.clone();
	$tr.find('button').remove();
	$tr.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", idx);
	});
	$(this).closest('table').append($tr);
	$row.find('input').each(function() {
		this.value = this.defaultValue;
	});
});
$('button').prop("disabled", false);