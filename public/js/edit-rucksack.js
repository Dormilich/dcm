$('form').on("submit", function() {
	$(this).find(".panel-footer").remove();
	$(this).find("input[type='number']").each(function() {
		if (0 == this.value) {
			$(this).closest(".form-group").remove();
		}
	});
});
$('#add').on("click", function() {
	var idx  = $(this).closest('.panel').find('.panel-body .form-group').length;
	var $row = $(this).closest('.panel-footer').find('.form-group');
	var $tr  = $row.clone();
	$tr.find('*[name]').each(function() {
		this.name = this.name.replace("{index}", idx);
	});
	$(this).closest('.panel').find('.panel-body .container-fluid').append($tr);
	$row.find('input').each(function() {
		this.value = this.defaultValue;
	});
});
$('button').prop("disabled", false);