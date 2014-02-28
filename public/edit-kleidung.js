$('form').on("submit", function() {
	$(this).find("tfoot").remove();
});
$('table').on("click", '.isactive', function() {
	$(this).closest('tr').find('*[name]').prop("disabled", !this.checked);
});
$('#add').on("click", function() {
	var $row = $(this).closest("tr");
	var $tr  = $row.clone();
	$tr.find('button').remove();
	$(this).closest('table').append($tr);
	$row.find('input').each(function() {
		this.value = this.defaultValue;
	});
});
$('#liste').on("click", 'input', function() {
	var ids = ["ko", "br", "ru", "ba", "ra", "la", "rb", "lb", "rs", "be"]
	if (this.checked) {
		ids.forEach(function(id) {
			var inp = document.getElementById(id);
			inp.value = +inp.value + +this.dataset[id];
		}, this);
	}
	else {
		ids.forEach(function(id) {
			var inp = document.getElementById(id);
			inp.value -= this.dataset[id];
		}, this);
	}
});
$('button').prop("disabled", false);
